package com.troupe.backend.domain.member;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Table(name = "tb_member_guestbook")
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Guestbook implements Serializable {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer guestbookNo;

    @ManyToOne(targetEntity = Member.class, fetch = FetchType.LAZY)
    @JoinColumn(name = "host_member_no")
    private Member hostMember;

    @ManyToOne(targetEntity = Member.class, fetch = FetchType.LAZY)
    @JoinColumn(name = "visitor_member_no")
    private Member visitorMember;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdTime;

    private String content;

    private boolean isRemoved;

    public void setGuestbookNo(Integer guestbookNo) {
        this.guestbookNo = guestbookNo;
    }

    public void setHostMember(Member hostMember) {
        this.hostMember = hostMember;
    }

    public void setVisitorMember(Member visitorMember) {
        this.visitorMember = visitorMember;
    }

    public void setCreatedTime(Date createdTime) {
        this.createdTime = createdTime;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setRemoved(boolean removed) {
        isRemoved = removed;
    }
}
