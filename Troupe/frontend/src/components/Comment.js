import React, { useEffect, useState } from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import apiClient from "../apiClient";
import CommentForm from "./CommentForm";
import { Grid } from "@mui/material";
import TextField from "@mui/material/TextField";
import CommentList from "./CommentList";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReplyIcon from "@mui/icons-material/Reply";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SendIcon from "@mui/icons-material/Send";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
const MySwal = withReactContent(Swal)
export default function Comment(props) {
  const [user, setUser] = useState(0);
  // 대댓글 목록
  const [childComments, setChildComments] = useState([]);
  // 대댓글 목록 가시 여부
  const [isChild, setIsChild] = useState(false);
  // 대댓글 등록 여부
  const [isChildReviewRegister, setIsChildReviewRegister] = useState(false);

  const [content, setContent] = useState("");
  const [modify, setModify] = useState(false);
  const [deleted, setDeleted] = useState(false);
  // 대댓글 등록 취소 여부
  const [cancel, setCancel] = useState(false);

  useEffect(() => {
    setContent(props.comment);
    // if(!props.parentCommentNo)
    //   setContent(props.comment);
    // else {
    //   if(props.)
    // }
    if (sessionStorage.getItem("loginCheck"))
      setUser(parseInt(sessionStorage.getItem("loginMember")));

    // setChildComments(props.childComments);

    if (props.kind === "performance") {
      //  공연 후기 대댓글 목록 불러오기
      apiClient
        .getPerfChildReviewList(props.performanceNo, props.reviewNo)
        .then((data) => {
          const json = [];

          data.forEach((item) => {
            json.push({
              memberNo: item.memberNo,
              reviewNo: item.reviewNo,
              profileImageUrl: item.profileImageUrl,
              comment: item.comment,
              nickname: item.nickname,
              isRemoved: item.removed,
              pfNo: item.pfNo,
            });
          });
          setChildComments(json);
        });
    } else if (props.kind === "feed") {
      //  피드 댓글의 대댓글 목록 불러오기
      apiClient
        .getFeedChildReviewList(props.feedNo, props.reviewNo)
        .then((data) => {
          console.log(data);
          const json = [];

          data.forEach((item) => {
            json.push({
              memberNo: item.memberNo,
              reviewNo: item.commentNo,
              profileImageUrl: item.profileImageUrl,
              comment: item.content,
              nickname: item.nickname,
              isRemoved: item.removed,
            });
          });
          setChildComments(json);
        });
    }
  }, []);

  function onChangeContent(event) {
    setContent(event.target.value);
  }
  //  답글 작성 클릭
  const childCommentRegister = (event) => {
    setCancel(!cancel);
    setIsChild(true);
    if (!sessionStorage.getItem("loginCheck")) {
      sessionStorage.setItem("currentHref", window.location.href);
      // if (window.confirm("로그인이 필요합니다. 로그인 하시겠습니까?"))
      window.location.href = `/login`;
    } else {
      setIsChildReviewRegister(true);
    }
  };
  // 대댓글 refresh
  const refreshChildFunction = (newComment) => {
    setChildComments([...childComments, newComment]);
  };
  // 대댓글 리스트 가시 여부
  const childCommentList = () => {
    setIsChild(!isChild);
  };

  //  댓글 수정
  const modifyComment = () => {
    setModify(!modify);
    if (modify) {
      const data = {
        content: content,
      };
      // props.modifyCommentFunc(props.somethingNo, props.reviewNo, data)
      //   .then(() => {
      //     setModify(!modify);
      //   });
      if (!props.feedNo) {
        apiClient
          .perfReviewModify(props.performanceNo, props.reviewNo, data)
          .then(() => {
            setModify(!modify);
          });
      } else {
        apiClient
          .feedCommentModify(props.feedNo, props.reviewNo, data)
          .then(() => {
            setModify(!modify);
          });
      }
    }
  };

  //  수정 취소
  const modifyCancel = () => {
    setContent(props.comment);
    setModify(!modify);
  };

  //  댓글 삭제
  const deleteComment = () => {
    Swal.fire({
      title: '삭제하시겠습니까?',
      showCancelButton: true,
      confirmButtonText: '예',
      cancelButtonText: '아니오',
      confirmButtonColor: 'red',
    }).then((result) => {
      if (result.isConfirmed) {
        if (!props.feedNo) {
          apiClient
            .perfReviewDelete(props.performanceNo, props.reviewNo)
            .then(() => {
              setContent("삭제된 댓글입니다.");
              setDeleted(true);
            });
        } else {
          apiClient.feedCommentDelete(props.feedNo, props.reviewNo).then(() => {
            setContent("삭제된 댓글입니다.");
            setDeleted(true);
          });
        }
      } 
    })
    // if (window.confirm("삭제하시겠습니까?")) {
    //   // props.deleteCommentFunc(props.somethingNo, props.reviewNo)
    //   //   .then(() => {
    //   //     setContent("삭제된 댓글입니다.");
    //   //     setDeleted(true);
    //   // })
     
    // }
  };

  //  댓글 등록 취소
  const cancelRegister = () => {
    setCancel(!cancel);
    setIsChildReviewRegister(!isChildReviewRegister);
  };

  // console.log(props);
  return (
    <Card sx={{ maxWidth: "100%", m: 2 }}>
      <CardHeader
        avatar={<Avatar alt={props.nickname} src={props.profileImageUrl} />}
        subheader={props.nickname}
        style={{ textAlign: "left" }}
      />
      <CardContent style={{ textAlign: "left" }}>
        <Typography variant="body1" color="textSecondary" component="p">
          {!props.isRemoved && !deleted ? (
            modify ? (
              <TextField
                fullWidth
                id="write-review-form"
                placeholder="댓글을 입력하세요."
                value={content}
                type="text"
                maxLength="500"
                onChange={onChangeContent}
              />
            ) : (
              <div>{content}</div>
            )
          ) : (
            <div style={{ fontSize: "12px" }}>삭제된 댓글입니다.</div>
          )}
        </Typography>
      </CardContent>

      <Grid>
        <Grid container justifyContent="flex-end">
          <Grid item>
            {/* {props.memberNo === user && !props.isRemoved && !deleted ? ( */}
            {props.memberNo === user && !props.isRemoved && !deleted ? (
              modify ? (
                <div>
                  <Button
                    size="small"
                    aria-label="modify"
                    onClick={() => modifyCancel()}
                  >
                    <CancelOutlinedIcon color="action"></CancelOutlinedIcon>
                  </Button>
                  <Button
                    size="small"
                    aria-label="modify"
                    onClick={() => modifyComment()}
                  >
                    <SendIcon color="action"></SendIcon>
                  </Button>
                </div>
              ) : (
                <Button
                  size="small"
                  aria-label="modify"
                  onClick={() => modifyComment()}
                  style={{ marginBottom: "20px" }}
                >
                  <ModeEditIcon color="action"></ModeEditIcon>
                </Button>
              )
            ) : (
              <div></div>
            )}
            {props.memberNo === user && !props.isRemoved && !deleted ? (
              <Button
                size="small"
                aria-label="delete"
                onClick={() => deleteComment()}
                style={{ marginBottom: "20px" }}
              >
                <DeleteIcon color="action"></DeleteIcon>
              </Button>
            ) : (
              <div></div>
            )}
            {!props.parentCommentNo && (
              <Button
                size="small"
                aria-label="child-comment"
                onClick={childCommentList}
                style={{ color: "black", marginBottom: "20px" }}
                // color="black"
              >
                <FormatListBulletedIcon color="action"></FormatListBulletedIcon>
                <Grid
                  style={{
                    marginTop: "3px",
                    marginLeft: "3px",
                    fontFamily: "Cafe24SsurroundAir",
                  }}
                >
                  ({childComments.length})
                </Grid>
              </Button>
            )}

            {!props.isRemoved &&
            !deleted &&
            !props.parentCommentNo &&
            !cancel ? (
              <Button
                size="small"
                arial-lebel="child-comment-register"
                onClick={childCommentRegister}
                style={{ marginBottom: "20px" }}
              >
                <ReplyIcon color="action"></ReplyIcon>
              </Button>
            ) : (
              <span></span>
            )}
            {cancel ? (
              <Button
                size="small"
                arial-lebel="child-comment-register"
                onClick={cancelRegister}
              >
                <CancelOutlinedIcon color="action"></CancelOutlinedIcon>
              </Button>
            ) : (
              <span></span>
            )}
          </Grid>
        </Grid>
        {isChildReviewRegister && (
          <Grid item>
            <CommentForm
              refreshChildFunction={refreshChildFunction}
              isChild={isChildReviewRegister}
              performanceNo={props.performanceNo}
              feedNo={props.feedNo}
              parentCommentNo={props.reviewNo}
            />
          </Grid>
        )}
        {isChild && (
          <CommentList
            kind={props.kind}
            refreshChildFunction={refreshChildFunction}
            commentList={childComments}
            performanceNo={props.performanceNo}
            feedNo={props.feedNo}
            parentCommentNo={props.reviewNo}
          />
        )}
      </Grid>
    </Card>
  );
}
