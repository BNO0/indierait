import React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import { useInfiniteQuery } from "react-query";
import apiClient from "../apiClient";
import FeedSaveButton from "./FeedSaveButton";
import FeedLikeButton from "./FeedLikeButton";
import { Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import stylesModal from "../css/modal.module.css";
import { Fragment } from "react";
import FeedDetail from "./FeedDetail";
import PlusButton from "./PlusButton";
import stylesTag from "../css/tag.module.css";

export default function _MinhoFeedList(props) {
  //카드이미지 width
  const [cardWidth, setCardWidth] = React.useState(window.innerWidth/4+window.innerWidth/20);

  //1000보다 큰경우 2화면분할
  const handleCardWidth = () => {
    const size = window.innerWidth/4+window.innerWidth/20;
    setCardWidth(size);
  };
  //화면분할 update
  React.useEffect(() => {
    window.addEventListener("resize", handleCardWidth);
  }, [window.innerWidth]);

  const [open, setOpen] = React.useState(false);
  const [feedNo, setFeedNo] = React.useState(0);
  const [isHover, setIsHover] = React.useState(-1);
  const [cards, setCards] = React.useState([]);
  const [pageNumber, setPageNumber] = React.useState(1);

  const [change, setChange] = React.useState(false);

  function handleOpen(no) {
    setOpen(true);
    setFeedNo(no);
    setChange(false);
  }
  function handleClose() {
    setOpen(false);
    setChange(true);
  }
  React.useEffect( () =>{
    if (props.memberInfo) {
    console.log(props.memberInfo.memberNo)
    apiClient.getMemberFeedList(0, props.memberInfo.memberNo, props.string).then((data)=>{
    setCards(data);
  });}
  }, [props.memberInfo]);
  console.log(cards);

async function fetchMore() {
  setPageNumber(pageNumber + 1);
  console.log(pageNumber)
  apiClient.getMemberFeedList(pageNumber, props.memberInfo.memberNo, props.string).then((data)=>{
    setCards([...cards, ...data])
  })}
  console.log(cards)

    return (
        <Grid container spacing={4}>
          {cards.map(card => 
              <Grid item key={`${card.feedNo}`} xs={4}>
                <Card
                  sx={{
                    position: "relative",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  elevation={0}
                  style={{
                    boxShadow:
                      "0 10px 35px rgba(0, 0, 0, 0.05), 0 6px 6px rgba(0, 0, 0, 0.5)",
                  }}
                >
                  <Grid container mt={1}>
                    <Grid ml={1}>
                      <a
                        style={{ textDecoration: "none" }}
                        href={"/profile/" + card.memberNo}
                      >
                        <img
                          src={card.profileImageUrl}
                          alt=""
                          style={{
                            borderRadius: "70%",
                            objectFit: "cover",
                            height: "30px",
                            width: "30px",
                            boxShadow:
                              "0 10px 35px rgba(0, 0, 0, 0.05), 0 6px 6px rgba(0, 0, 0, 0.1)",
                          }}
                        ></img>
                      </a>
                    </Grid>
                    <Grid ml={1} mb={2}>
                      <Typography
                        style={{
                          fontSize: "13px",
                          fontFamily: "SBAggroB",
                          wordBreak: "break-all",
                          overflow: "hidden",
                        }}
                        component="span"
                      >
                        {card.nickname}
                      </Typography>
                    </Grid>
                  </Grid>
                  <CardMedia
                    component="img"
                    sx={{
                      pb: 1,
                      objectFit: "cover",
                      width: `${cardWidth}px`,
                      height: `${cardWidth}px`,
                      opacity: isHover === card.feedNo ? 0.5 : null,
                      transform: isHover === card.feedNo ? "scale(1.1)" : null,
                      transition: "0.5s",
                    }}
                    image={Object.values(card.images)[0]}
                    alt=""
                    onClick={() => handleOpen(card.feedNo)}
                    onMouseEnter={() => setIsHover(card.feedNo)}
                    onMouseLeave={() => setIsHover(-1)}
                  ></CardMedia>
                  {isHover === card.feedNo ? (
                    <div
                      style={{
                        marginLeft: "0.5em",
                        display: "inline",
                        position: "absolute",
                        height: "300px",
                        width: "265px",
                        color: "black",
                        top: "150px",
                      }}
                      onMouseEnter={() => setIsHover(card.feedNo)}
                      onMouseLeave={() => setIsHover(-1)}
                      onClick={() => handleOpen(card.feedNo)}
                    >
                      {" "}
                      <div className={stylesTag.HashWrapOuter}>
                        {card.tags.map((tag) => (
                          <div className={stylesTag.HashWrapInner}>#{tag}</div>
                        ))}{" "}
                      </div>
                    </div>
                  ) : null}
                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                      margin: "5px",
                      padding: "0px",
                    }}
                  >
                    <Grid>
                      <FeedLikeButton
                        change={change}
                        feedNo={card.feedNo}
                      ></FeedLikeButton>
                    </Grid>
                    <Grid mr={-3}>
                      <FeedSaveButton
                        change={change}
                        feedNo={card.feedNo}
                      ></FeedSaveButton>
                    </Grid>
                  </CardActions>
                </Card>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="simple-modal-title"
                  aria-describedby="simple-modal-description"
                  className={stylesModal.outer}
                >
                  <FeedDetail
                    setChange={setChange}
                    feedNo={feedNo}
                    open={open}
                    handleClose={handleClose}
                    showSearch={props.showSearch}
                    handleShowSearch={props.handleShowSearch}
                    setTagList={props.setTagList}
                  ></FeedDetail>
                </Modal>
              </Grid>
            )
          }
        <PlusButton handleCard={fetchMore}></PlusButton>
        </Grid>
    );
}