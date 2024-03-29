import React from "react";
import { useParams } from "react-router-dom";
import apiClient from "../apiClient";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import InterestPolygon from "./InterestPolygon";
import LikeabilityRank from "./LikeabilityRank";
import styledTooltip from "../css/tooltip.module.css";

import InterestRadarChart from "./InterestRadarChart";

export default function ProfileAnalyze(props) {
  const [loginCheck, setLoginCheck] = React.useState(
    sessionStorage.getItem("loginCheck")
  );
  React.useEffect(() => {
    setLoginCheck(sessionStorage.getItem("loginCheck"));
  }, [sessionStorage.getItem("loginCheck")]);
  //memberNo
  const { memberNo } = useParams();

  //공연자/일반 판단 초기화
  const performer = props.performer;

  // 자신의 유저페이지인지 판단
  const myPage = props.myPage;

  //나와의 호감도보기
  const [likeabilityWithMember, setLikeabilityWithMember] =
    React.useState(false);

  //개인분석 결과
  // //이 member의 관심카테고리
  // const [interestCategoryData, setInterestCategoryData] = React.useState("");
  // React.useEffect(() => {
  //   apiClient.getInterestCategory(memberNo).then((data) => {
  //     setInterestCategoryData(data);
  //   });
  // });
  const [interestCategoryLabel, setInterestCategoryLabel] = React.useState([
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h',
  ]);
  const [interestCategoryData, setInterestCategoryData] = React.useState([
    10, 20, 30, 40, 50, 60, 70, 80,
  ]);
  // 이 member에 대한 나의 호감도 data
  const [myDataWithLikeability, setMyDataWithLikeability] = React.useState([]);
  //이 member의 호감도 data
  const [performerTop3, setPerformerTop3] = React.useState([]);
  React.useEffect(() => {
    if (!memberNo) {
      return;
    }
    //이 member가 호감도가 높은 공연자 탑3
    apiClient.getPerformerTop3({ profileMemberNo: memberNo }).then((data) => {
      console.log("dkdk");
      console.log(data);
      setPerformerTop3(data.top3Stars);
    });
    //이 member의 관심카테고리
    apiClient.getInterestCategory(memberNo).then((data) => {
      console.log(data);
      if (data.interestCategoryList && data.interestCategoryList[0]) {
        let labels = [];
        let counts = [];
        let totalCount = 0;
        data.interestCategoryList.map((object) => {
          labels.push(object.smallCategory);
          counts.push(object.count);
          totalCount += object.count;
        });
        for (let i = counts.length; i < 8; i++) {
          labels.push("-");
          counts.push(0);
        }
        for (let i = 0; i < counts.length; i++) {
          counts[i] = (counts[i] * 100) / totalCount;
        }
        console.log(counts);
        setInterestCategoryLabel(labels);
        setInterestCategoryData(counts);
      }
      // {
      //   categoryNo: int,
      //   bigCategory : String
      //   smallCategory: String
      //   codeName: String
      //   count : int
      // }
      // setInterestCategoryData(data);
    });
    //이 member의 호감도 data
    apiClient
      .getMyDataWithLikeability({ profileMemberNo: memberNo })
      .then((data) => {
        console.log(data);
        setMyDataWithLikeability([data]);
      });
  }, [memberNo]);

  //이 member에 대한 나의 호감도 exp
  const [myLikeabilityExp, setMyLikeabilityExp] = React.useState(1222);
  //이 member에 대한 나의 호감도 순위
  const [myLikeabilityRank, setMyLikeabilityRank] = React.useState(78);

  // 나와의 호감도/ 이유저의 호감도 보기 노출여부 설정
  React.useEffect(() => {
    if (!performer) {
      setLikeabilityWithMember(false);
    }
  }, [performer]);

  // 나와의 호감도/ 이유저의 호감도 보기 버튼클릭
  const changeLikeability = () => {
    setLikeabilityWithMember((current) => !current);
  };

  return (
    <Card
      sx={{ width: props.width }}
      style={{
        border: "5px solid #FFCF24",
        backgroundColor: "#FFFFFF",
        borderRadius: "5px",
        boxShadow:
          "0 10px 35px rgba(0, 0, 0, 0.05), 0 6px 6px rgba(0, 0, 0, 0.6)",
      }}
    >
      <CardContent>
        {likeabilityWithMember ? (
          <Grid container spacing={1} style={{ textAlign: "center" }}>
            <Grid item xs={12}>
              <div style={{ position: "relative", textAlign: "right" }}>
                <div className={styledTooltip.tooltipcontainer}></div>
                <div className={styledTooltip.tooltip}>
                  <InfoOutlinedIcon />
                  <Button
                    style={{
                      color: "black",
                      fontFamily: "Cafe24SsurroundAir",
                      marginBottom: "14px",
                    }}
                    onClick={changeLikeability}
                  >
                    {props.nickname} 님의 호감도 순위 보기
                  </Button>
                  <div
                    className={`${styledTooltip.tooltiptext} ${styledTooltip.tooltipleft}`}
                    style={{ fontFamily: "Cafe24SsurroundAir" }}
                  >
                    {props.nickname} 님의{" "}
                    <span
                      style={{
                        color: "#fda085",
                      }}
                    >
                      호감도 순위
                    </span>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} style={{ position: "relative" }}>
              <LikeabilityRank
                nickname={props.nickname}
                likeabilityWithMember={likeabilityWithMember}
                likeabilityData={myDataWithLikeability}
                style={{ position: "absolute", top: "50%" }}
              ></LikeabilityRank>
            </Grid>
          </Grid>
        ) : (
          <Grid
            container
            spacing={2}
            alignItems="center"
            style={{ textAlign: "center" }}
          >
            <Grid item xs={6}></Grid>
            <Grid item xs={6}>
              {myPage || !performer || !loginCheck ? (
                <div></div>
              ) : (
                <div style={{ position: "relative", textAlign: "right" }}>
                  <div className={styledTooltip.tooltipcontainer}>
                    <div className={styledTooltip.tooltip}>
                      <InfoOutlinedIcon />
                      <Button
                        style={{
                          color: "black",
                          fontFamily: "Cafe24SsurroundAir",
                          marginBottom: "14px",
                        }}
                        onClick={changeLikeability}
                      >
                        나와의 호감도 보기
                      </Button>
                      <div
                        className={`${styledTooltip.tooltiptext} ${styledTooltip.tooltipleft}`}
                        style={{ fontFamily: "Cafe24SsurroundAir" }}
                      >
                        {props.nickname} 님에 대한{" "}
                        <span
                          style={{
                            color: "#fda085",
                          }}
                        >
                          나의 호감도 순위
                        </span>
                      </div>
                    </div>
                    {/* )} */}
                  </div>
                </div>
              )}
            </Grid>
            <Grid item xs={6}>
              <InterestPolygon
                nickname={props.nickname}
                data={interestCategoryData}
                label={interestCategoryLabel}
              ></InterestPolygon>
              {/* <InterestRadarChart
                nickname={props.nickname}
                data={interestCategory}
              ></InterestRadarChart> */}
            </Grid>
            <Grid item xs={6}>
              <LikeabilityRank
                nickname={props.nickname}
                likeabilityWithMember={likeabilityWithMember}
                likeabilityData={performerTop3}
                width={props.width}
              ></LikeabilityRank>
            </Grid>
            <Grid item xs={6}>
              {" "}
              <div
                style={{
                  position: "relative",
                  textAlign: "center",
                  marginTop: "10px",
                }}
              >
                {props.nickname} 님의{" "}
                <span style={{ color: "#fda085" }}>관심사</span>
              </div>
            </Grid>
            <Grid item xs={6}>
              <div
                style={{
                  position: "relative",
                  bottom: "0%",
                }}
              >
                {props.nickname} 님의{" "}
                <span
                  style={{
                    color: "#fda085",
                  }}
                >
                  호감도 순위
                </span>
              </div>
            </Grid>
          </Grid>
        )}
      </CardContent>
    </Card>
  );
}
