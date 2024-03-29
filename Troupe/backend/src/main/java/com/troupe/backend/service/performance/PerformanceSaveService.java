package com.troupe.backend.service.performance;

import com.troupe.backend.domain.category.Category;
import com.troupe.backend.domain.member.Member;
import com.troupe.backend.domain.performance.Performance;
import com.troupe.backend.domain.performance.PerformanceSave;
import com.troupe.backend.dto.performance.response.ProfilePfResponse;
import com.troupe.backend.dto.performance.response.ProfilePfSaveResponse;
import com.troupe.backend.repository.category.CategoryRepository;
import com.troupe.backend.repository.member.MemberRepository;
import com.troupe.backend.repository.performance.PerformanceRepository;
import com.troupe.backend.repository.performance.PerformanceSaveRepository;
import com.troupe.backend.service.member.LikabilityService;
import com.troupe.backend.util.MyConstant;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;


@Slf4j
@RequiredArgsConstructor
@Service
public class PerformanceSaveService {

    private final MemberRepository memberRepository;
    private final PerformanceRepository performanceRepository;
    private final PerformanceSaveRepository performanceSaveRepository;
    private final PerformanceImageService performanceImageService;

    private final LikabilityService likabilityService;

    private final CategoryRepository categoryRepository;

    /**
     * 공연 북마크
     * <p>
     * 로그인 유저인지 비로그인 유저인지 확인
     * 임시로 header로 넘어오는 memberNo로 확인 -> 토큰 정보로 변경해야함
     * memberNo 키가 없거나 값이 없으면 비로그인 유저
     * 값이 았으면 pfNo 검증
     * 키 값을 이용하거나, 값을 넘겨주되 비로그인 유저만을 구분짓는 값을 넘겨주는 방식 중 1개만 이용하면 될 것 같다.
     *
     * @param memberNo
     * @param pfNo
     */
    @Transactional
    public void save(int memberNo, int pfNo) {
        //  키 값 이용, memberNo라는 키가 존재하는가?
//        if(!requestHeader.containsKey(MyConstant.MEMBER_NO)){
//            log.info("키 값 존재하지 않음");
//            throw new NoSuchElementException("로그인이 필요합니다.");
//        }

        //  비로그인 유저만의 값 이용
        if (memberNo == 0) {
            log.info("유효 하지 않은 값");
            throw new NoSuchElementException("로그인이 필요합니다.");
        }

        //  -----------------------------------------------------------------------------------
        //  공연 검증(있는 공연으로 클릭한거니까 없어도 될 것 같다.)
        //  공연 id가 없는 경우
        Performance performance = performanceRepository.findById(pfNo)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 공연입니다."));

        //  공연은 존재하는데 삭제된 경우
        if (performance.isRemoved())
            throw new NoSuchElementException("삭제된 공연 입니다.");

        //  -----------------------------------------------------------------------------------
        //  로그인한 유저, 존재하는 공연
        Member member = memberRepository.findById(memberNo).get();

        // 1. LocalDateTime 객체 생성(현재 시간)
        LocalDateTime localDateTime = LocalDateTime.now();
        // 2. LocalDateTime -> Date 변환
        Date now = java.sql.Timestamp.valueOf(localDateTime);

        performanceSaveRepository.findByMemberAndPf(member, performance)
                .ifPresentOrElse(
                        //  검색 결과가 있으면 한 번 삭제하고 다시 저장하는 경우
                        (found) -> {
                            //  이미 생성한 것은 넘어감,(없는 경우)
//                            if(!found.getRemoved())
//                                return;
                            found.setRemoved(false);
                            found.setCreatedTime(now);
                            performanceSaveRepository.save(found);
                        }
                        ,
                        //  검색 결과가 없으면, 최초 저장 실행
                        () -> performanceSaveRepository.save(PerformanceSave.builder()
                                .member(member)
                                .pf(performance)
                                .createdTime(now)
                                .isRemoved(false)
                                .build()
                        )
                );

        // 호감도 갱신
        int starMemberNo = performance.getMember().getMemberNo();
        int fanMemberNo = memberNo;
        likabilityService.updateExp(starMemberNo, fanMemberNo, MyConstant.EXP_PERFORMANCE_SAVE);
    }

    /**
     * 공연 북마크 삭제
     * 유저 번호와 공연 번호를 가지고 공연 북마크 삭제 처리
     *
     * @param memberNo
     * @param pfNo
     */
    @Transactional
    public void delete(int memberNo, int pfNo) {
        Member member = memberRepository.findById(memberNo).get();
        Performance performance = performanceRepository.findById(pfNo).get();

        // 1. LocalDateTime 객체 생성(현재 시간)
        LocalDateTime localDateTime = LocalDateTime.now();
        // 2. LocalDateTime -> Date 변환
        Date now = java.sql.Timestamp.valueOf(localDateTime);

        PerformanceSave found = performanceSaveRepository.findByMemberAndPf(member, performance).get();
        found.setRemoved(true);
        found.setCreatedTime(now);

        performanceSaveRepository.save(found);

        // 호감도 갱신
        int starMemberNo = performance.getMember().getMemberNo();
        int fanMemberNo = memberNo;
        likabilityService.updateExp(starMemberNo, fanMemberNo, -MyConstant.EXP_PERFORMANCE_SAVE);
    }

    /**
     * 유저가 저장한 공연 목록 리스트 반환
     *
     * @param memberNo
     * @return
     */
    @Transactional(readOnly = true)
    public List<ProfilePfResponse> findSavedList(int memberNo, Pageable pageable) {
        Member member = memberRepository.findById(memberNo).get();
        Slice<PerformanceSave> performanceSaveList = performanceSaveRepository.findByMemberAndRemovedFalse(member, pageable);

        // 공연 상태 계산
        // 1. LocalDateTime 객체 생성(현재 시간)
        LocalDateTime localDateTime = LocalDateTime.now();
        // 2. LocalDateTime -> Date 변환
        Date now = java.sql.Timestamp.valueOf(localDateTime);

        List<ProfilePfResponse> profilePfResponseList = new ArrayList<>();
        for (PerformanceSave performanceSave : performanceSaveList) {
            Performance p = performanceSave.getPf();

            //  공연 상태 계산
            StringBuilder sb = new StringBuilder();
            if(now.before(p.getStartDate())) sb.append(MyConstant.PREV);
            else if(now.after(p.getStartDate()) && now.before(p.getEndDate())) sb.append(MyConstant.ING);
            else if(now.after(p.getEndDate())) sb.append(MyConstant.END);

            Map<Integer, String> images = performanceImageService.findPerformanceImagesByPerformance(p);

            profilePfResponseList.add(ProfilePfResponse.builder()
                    .pfNo(p.getId())
                    .memberNo(member.getMemberNo())
                    .nickname(member.getNickname())
                    .title(p.getTitle())
                    .description(p.getDescription())
                    .images(images)
                    .poster(p.getPosterUrl())
                    .category(p.getCategory().getSmallCategory())
                    .status(sb.toString())
                    .runtime(p.getRuntime())
                    .startDate(p.getStartDate())
                    .endDate(p.getEndDate())
                    .build()
            );
        }
        return profilePfResponseList;
    }

    @Transactional(readOnly = true)
    public List<PerformanceSave> getPerformanceSaveList(int memberNo) {
        Member member = memberRepository.findById(memberNo).get();

        return performanceSaveRepository.findAllByMemberAndIsRemoved(member, false);
    }

    @Transactional(readOnly = true)
    public Map<Category, Integer> countInterestTags(int memberNo) {
        List<PerformanceSave> performanceSaveList = getPerformanceSaveList(memberNo);

        HashMap<Category, Integer> categoryCount = new HashMap<>();

        // 모든 카테고리에 대해 0으로 초기화
        List<Category> allCategories = categoryRepository.findAll();
        for (Category cat : allCategories) {
            categoryCount.put(cat, 0);
        }

        // 존재하는 카테고리 수만큼 카운트
        for (PerformanceSave performanceSave : performanceSaveList) {
            Category category = performanceSave.getPf().getCategory();
            categoryCount.put(category, 1 + categoryCount.getOrDefault(category, 0));
        }

        System.out.println(categoryCount.toString());

        return categoryCount;
    }

    @Transactional(readOnly = true)
    public boolean checkPfSave(int memberNo, int PfNo){
        Member member = memberRepository.findById(memberNo)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 유저 입니다."));

        Performance performance = performanceRepository.findById(PfNo)
                .orElseThrow(() -> new NoSuchElementException("존재하지 않는 공연 입니다."));

        Optional<PerformanceSave> check = performanceSaveRepository.findByMemberAndPfAndRemovedFalse(member, performance);
        if (check.isPresent()) return true;
        else return false;
    }
}