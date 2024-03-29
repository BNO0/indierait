package com.troupe.backend.repository.likability;

import com.troupe.backend.domain.likability.Likability;
import com.troupe.backend.domain.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LikabilityRepository extends JpaRepository<Likability, Integer> {
    /** starMember와 fanMember간의 호감도를 조회 */
    Optional<Likability> findByStarMemberAndFanMember(Member starMember, Member fanMember);

    /** starMember와 호감도가 존재하는 모든 사람과의 호감도를 조회 */
    List<Likability> findAllByStarMember(Member starMember);

    /** fanMember와 호감도가 존재하는 모든 사람과의 호감도를 조회 */
    List<Likability> findAllByFanMember(Member fanMember);

    /** starMember에 대해서 특정 경험치보다 높은 유저 수를 조회 */
    Long countByStarMemberAndExpGreaterThan(Member starMember, Integer exp);

    List<Likability> findTop3ByFanMemberOrderByExpDesc(Member fanMember);

    List<Likability> findTop100ByStarMemberOrderByExpDesc(Member starMember);

}