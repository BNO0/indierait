import * as React from "react";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import { ThemeProvider } from "@mui/material/styles";
import PerfFeedToggle from "./MainButton";
import apiClient from "../apiClient";
import FeedDetail from "./FeedDetail";
import Modal from "@mui/material/Modal";
import stylesModal from "../css/modal.module.css";
import FeedLikeButton from "./FeedLikeButton";
import FeedSaveButton from "./FeedSaveButton";
import stylesFont from "../css/font.module.css";
import borderImg from "../img/borderImg.png";
import frame from "../img/frame.png";
import { fontFamily } from "@mui/system";
import PlusButton from "./PlusButton";
import Theme from "./Theme";
// 피드상세 모달구현을 위한 임시페이지 (후에 삭제 예정)
function Copyright() {
  return (
    <Typography color="text.secondary" align="center" component="span">
      {"Copyright © "}
      <Link color="inherit" href="/">
        Troupe
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

function TagSearchForm() {
  return <div></div>;
}

function range(start, end) {
  let array = [];
  for (let i = start; i < end; ++i) {
    array.push(i);
  }
  console.log(array);
  return array;
}

export default function Album() {
  const [open, setOpen] = React.useState(false);
  const [feedNo, setFeedNo] = React.useState(0);
  let [cards, setCard] = React.useState([
    {
      feedNo: 0,
      nickname: "",
      profileImageUrl: "",
    },
  ]);
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

  function handleCard() {
    let pages = 6;
    pages = pages + 6;
    setCard(range(0, pages));
  }

  const changeFunction = (check) => {
    setChange(check);
  };
  React.useEffect(() => {
    // const data = {
    //   change: "all",
    //   pageNumber: 0,
    // };
    apiClient.getFeedTest().then((data) => {
      console.log(data);
      setCard(data);
    });
  }, []);

  return (
    <ThemeProvider theme={Theme}>
      <CssBaseline />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <PerfFeedToggle></PerfFeedToggle>
      </div>

      <main>
        <Container sx={{ py: 10 }} maxWidth="md">
          <Grid container spacing={4}>
            {cards.map((card, id) => (
              <Grid
                item
                key={id}
                xs={12}
                sm={6}
                md={4}
                className={stylesFont.border}
              >
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                  elevation={0}
                >
                  <Typography
                    gutterBottom
                    component="span"
                    fontFamily="SBAggroB"
                  >
                    <img
                      src={card.profileImageUrl}
                      alt="random"
                      style={{
                        borderRadius: "70%",
                        objectFit: "cover",
                        height: "20px",
                        width: "20px",
                      }}
                    ></img>
                    {card.nickname}
                  </Typography>
                  <CardMedia
                    component="img"
                    sx={{
                      pb: 1,
                      objectFit: "cover",
                      width: "300px",
                      height: "300px",
                    }}
                    image="https://source.unsplash.com/random"
                    alt="random"
                    onClick={() => handleOpen(card.feedNo)}
                  />
                  <CardActions
                    sx={{
                      justifyContent: "space-between",
                      margin: "0px",
                      padding: "0px",
                    }}
                  >
                    <FeedLikeButton
                      change={change}
                      feedNo={card.feedNo}
                    ></FeedLikeButton>
                    <FeedSaveButton
                      change={change}
                      feedNo={card.feedNo}
                    ></FeedSaveButton>
                  </CardActions>
                  {/* <img
                    src={frame}
                    className={stylesFont.borderImg}
                    onClick={() => handleOpen(card.feedNo)}
                  ></img> */}
                </Card>
              </Grid>
            ))}
          </Grid>
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
            ></FeedDetail>
          </Modal>
        </Container>
      </main>
      <PlusButton handleCard={handleCard}></PlusButton>
    </ThemeProvider>
  );
}
