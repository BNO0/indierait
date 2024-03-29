import React from "react";
import apiClient from "../apiClient";
import Button from "@mui/material/Button";
import styledButton from "../css/button.module.css";
import Theme from "./Theme";
import { ThemeProvider } from "@mui/material/styles";
export default function FollowButton(props) {
  //memberNo
  const [memberNo, setMemberNo] = React.useState("");
  // 이 유저를 팔로우 했는지 판단초기화
  const [isFollowing, setIsFollowing] = React.useState(false);
  //memberNo update 시
  React.useEffect(() => {
    setMemberNo(props.memberNo);
    // 이 유저를 팔로우 했는지 판단 update
    if (sessionStorage.getItem("loginCheck") && props.memberNo) {
      apiClient
        .isFollowing({
          profileMemberNo: props.memberNo,
          fanMamberNo: sessionStorage.getItem("loginMember"),
        })
        .then((data) => {
          console.log(data);
          setIsFollowing(data.isFollowing);
        });
    }
  }, [props.memberNo]);
  // follow/unfollow 버튼클릭
  const followClick = () => {
    if (!sessionStorage.getItem("loginCheck")) {
      sessionStorage.setItem("currentHref", window.location.href);
      window.location.href = "/login";
    } else {
      const currnetFollow = isFollowing;
      setIsFollowing(!isFollowing);
      const followData = {
        currentFollow: currnetFollow,
        profileMemberNo: memberNo,
      };
      apiClient.follow(followData).then((data) => {
        if (!data) {
          setIsFollowing(currnetFollow);
        }
      });
    }
  };

  return isFollowing ? (
    <ThemeProvider theme={Theme}>
      <Button
        className={styledButton.btn}
        onClick={followClick}
        style={{
          width: "130px",
          color: "black",
          border: "3px solid white",
        }}
      >
        - UnFollow
      </Button>
    </ThemeProvider>
  ) : (
    <ThemeProvider theme={Theme}>
      <Button
        className={styledButton.btn2}
        variant="contained"
        color="green"
        style={{
          width: "130px",
          border: "3px solid white",
        }}
        onClick={followClick}
      >
        + Follow
      </Button>
    </ThemeProvider>
  );
}
