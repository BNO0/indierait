package com.troupe.backend.service.performance;

import com.troupe.backend.domain.performance.Performance;
import com.troupe.backend.domain.performance.PerformancePrice;
import com.troupe.backend.dto.performance.form.PerformanceForm;
import com.troupe.backend.dto.performance.form.PerformanceModifyForm;
import com.troupe.backend.dto.converter.PerformanceConverter;
import com.troupe.backend.repository.performance.PerformancePriceRepository;
import com.troupe.backend.repository.performance.PerformanceRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@Service
public class PerformancePriceService {

    private final PerformanceRepository performanceRepository;
    private final PerformancePriceRepository performancePriceRepository;

    private final PerformanceConverter performanceConverter;
    /**
     * 좌석 등록(가격 생성)
     *
     * @param performance
     * @param performanceform
     */
    @Transactional
    public void addPerformancePrice(PerformanceForm performanceform, Performance performance) {
        //  가격 엔티티들 생성
        List<PerformancePrice> priceList = performanceConverter.toPerformancePriceEntityWhenCreate(performanceform, performance);
        performancePriceRepository.saveAll(priceList);

    }

    /**
     * 좌석 수정(가격 수정)
     * @param performance
     * @param performanceModifyForm
     */
    @Transactional
    public void updatePerformancePrice(PerformanceModifyForm performanceModifyForm, Performance performance) {
        //  공연 번호와 매치되는 좌석 모두 찾기
        List<PerformancePrice> performancePriceList = performancePriceRepository.findByPf(performance);
        //  해당 좌석들의 정보를 테이블에서 모두 삭제하기
        for (PerformancePrice price : performancePriceList) {
            performancePriceRepository.deleteById(price.getId());
        }
        //  변경사항 입력하기
        List<PerformancePrice> priceList = performanceConverter.toPerformancePriceEntityWhenUpdate(performanceModifyForm, performance);
        performancePriceRepository.saveAll(priceList);
    }

    /**
     * 좌석 삭제(가격 삭제)
     * @param targetPerformance
     */
    @Transactional
    public void deletePerformancePrice(Performance targetPerformance){
        List<PerformancePrice> performancePriceList = performancePriceRepository.findByPf(targetPerformance);
        //  해당 좌석들의 정보를 테이블에서 모두 삭제하기
        for (PerformancePrice price : performancePriceList) {
            performancePriceRepository.deleteById(price.getId());
        }
    }

    /**
     * 공연 번호와 매치되는 좌석 모두 찾기
     * @param performance
     * @return
     */
    @Transactional
    public List<PerformancePrice> findAllPrice(Performance performance){
        return performancePriceRepository.findByPf(performance);
    }

}
