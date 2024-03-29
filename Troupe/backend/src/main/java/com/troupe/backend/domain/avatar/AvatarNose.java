package com.troupe.backend.domain.avatar;

import lombok.*;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.io.Serializable;

@Entity
@Table(name = "tb_avatar_nose")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AvatarNose implements Serializable {
    @Id
    private Integer noseNo;

    private String noseUrl;
}
