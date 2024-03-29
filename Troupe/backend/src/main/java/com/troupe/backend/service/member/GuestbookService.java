package com.troupe.backend.service.member;

import com.troupe.backend.domain.member.Guestbook;
import com.troupe.backend.domain.member.Member;
import com.troupe.backend.dto.guestbook.GuestbookForm;
import com.troupe.backend.exception.member.DuplicatedGuestbookException;
import com.troupe.backend.repository.member.GuestbookRepository;
import com.troupe.backend.repository.member.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.Optional;
@Slf4j
@Service
@Transactional
@RequiredArgsConstructor
public class GuestbookService {
    private final GuestbookRepository guestbookRepository;

    private final MemberRepository memberRepository;

    /**
     * 방명록 저장
     */
    public Guestbook saveGuestbook(GuestbookForm guestbookForm) {
        Member hostMember = memberRepository.findById(guestbookForm.getHostMemberNo()).get();
        Member visitorMember = memberRepository.findById(guestbookForm.getVisitorMemberNo()).get();

        // 한 게스트가 한 호스트에게 하나의 게시글만 작성하도록 한다
        if (guestbookRepository.findByHostMemberAndVisitorMemberAndIsRemovedFalse(hostMember, visitorMember).isPresent()) {
            throw new DuplicatedGuestbookException();
        }

        LocalDateTime localDateTime = LocalDateTime.now(ZoneId.of("Asia/Seoul"));
        Date now = java.sql.Timestamp.valueOf(localDateTime);
        Guestbook guestbook = Guestbook.builder()
                .hostMember(hostMember)
                .visitorMember(visitorMember)
                .content(guestbookForm.getContent())
                .createdTime(now)
                .isRemoved(false)
                .build();

        return guestbookRepository.save(guestbook);
    }

    /**
     * 방명록 삭제
     */
    public Guestbook deleteGuestbook(int guestbookNo) {
        Guestbook foundGuestbook = guestbookRepository.findById(guestbookNo).get();
        foundGuestbook.setRemoved(true);
        return guestbookRepository.save(foundGuestbook);
    }

    /**
     * 방명록 수정
     */
    public Guestbook updateGuestbook(GuestbookForm guestbookForm) {
        Guestbook foundGuestbook = findGuestBook(guestbookForm.getHostMemberNo(), guestbookForm.getVisitorMemberNo()).get();

        foundGuestbook.setContent(guestbookForm.getContent());
        return foundGuestbook;
    }

    /**
     * 호스트 멤버에게 달린 모든 방명록 글 리스트를 조회
     */
    public List<Guestbook> findGuestbookListOfHost(int hostMemberNo) {
        Member hostMember = memberRepository.findById(hostMemberNo).get();
        return guestbookRepository.findAllByHostMemberAndIsRemovedFalseOrderByCreatedTimeDesc(hostMember);
    }

    /**
     * 특정 방명록 글을 조회
     */
    public Optional<Guestbook> findGuestBook(int hostMemberNo, int visitorMemberNo) {
        Member hostMember = memberRepository.findById(hostMemberNo).get();
        Member visitorMember = memberRepository.findById(visitorMemberNo).get();
        return guestbookRepository.findByHostMemberAndVisitorMemberAndIsRemovedFalse(hostMember, visitorMember);
    }

}
