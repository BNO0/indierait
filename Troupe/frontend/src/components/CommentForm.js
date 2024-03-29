import React, { useEffect, useState } from "react";
import CreateIcon from "@mui/icons-material/Create";
import { IconButton, TextField } from "@mui/material";
import apiClient from "../apiClient";

export default function CommentForm(props) {
  const [review, setReview] = useState("");
  const [isChild, setIsChild] = useState(props.isChild);

  useEffect(() => {
    // console.log(props.isChild);
  }, []);

  const reset = () => setReview("");

  //  답글 폼 변화 인식
  const onChange = (event) => {
    setReview(event.target.value);
  };

  const reviewRegister = () => {
    if (!sessionStorage.getItem("loginCheck")) {
      sessionStorage.setItem("currentHref", window.location.href);
      // if (window.confirm("로그인이 필요합니다. 로그인 하시겠습니까?"))
      window.location.href = `/login`;
    } else {
      let data = {
        content: review,
      };
      console.log(props.kind);
      if (props.kind === "performance") {
        data = {
          content: review,
          parentCommentNo: 0,
        };
        apiClient.perfReviewNew(
          props.performanceNo,
          data,
          props.refreshFunction,
        );
      } else if (props.kind === "feed") {
        apiClient.feedCommentNew(props.feedNo, data, props.refreshFunction);
      }
      reset();
    }
  };

  const childReviewRegister = () => {
    // console.log(props.performanceNo);
    const data = {
      content: review,
    };
    if (!props.feedNo) {
      apiClient.perfChildReviewNew(
        props.performanceNo,
        props.parentCommentNo,
        data,
        props.refreshChildFunction,
      );
    } else {
      apiClient.feedChildCommentNew(
        props.feedNo,
        props.parentCommentNo,
        data,
        props.refreshChildFunction,
      );
    }
    reset();
  };

  const WriteButton = () => (
    <IconButton onClick={isChild ? childReviewRegister : reviewRegister}>
      <CreateIcon color="grey" />
    </IconButton>
  );

  return (
    <div>
      <TextField
        fullWidth
        id="write-review-form"
        placeholder="댓글을 입력하세요."
        value={review}
        type="text"
        maxLength="500"
        onChange={onChange}
        InputProps={{ endAdornment: <WriteButton /> }}
        sx={{
          "& .MuiOutlinedInput-root.Mui-focused": {
            "& > fieldset": {
              borderColor: "#66cc66",
            },
          },
          background: "white",
        }}
      />
      <form>
        <input type="hidden" value={review}></input>
      </form>
    </div>
  );
}
