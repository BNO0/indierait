import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

export default function Avatar(props) {
  const [sizeString, setSizeString] = React.useState("px");
	const [avatarResponse, setAvatarResponse] = React.useState(props.avatarResponse);
  const [imgWidth, setImgWidth] = React.useState(75);
  const [imgHeight, setImgHeight] = React.useState(100);
  const [divWidth, setDivWidth] = React.useState(75);
  const [divHeight, setDivHeight] = React.useState(50);
  const [left, setLeft] = React.useState(0);
  const [top, setTop] = React.useState(0);
  //아바타 버튼여부
  const [button, setButton] = React.useState(false);
  React.useEffect(() => {
    if (props.imgWidth) {
      setImgWidth(props.imgWidth);
    }
    if (props.imgHeight) {
      setImgHeight(props.imgHeight);
    }
    if (props.divWidth) {
      setDivWidth(props.divWidth);
    }
    if (props.divHeight) {
      setDivHeight(props.divHeight);
    }
    if (props.left) {
      setLeft(props.left);
    }
    if (props.top) {
      setTop(props.top);
    }
  }, []);
  React.useEffect(() => {
    if (props.avatarResponse) {
      console.log(props.avatarResponse);
      console.log(props.avatarResponse.avatarShapeResponse)
      setAvatarResponse(props.avatarResponse);
    }
  }, [props.avatarResponse]);
  React.useEffect(() => {
    if (props.button) {
      console.log(props.button);
      setButton(true);
    }
  }, [props.button]);
  React.useEffect(() => {
    if (props.sizeString) {
      console.log(props.sizeString);
      setSizeString(props.sizeString);
    }
  }, [props.sizeString]);
  return avatarResponse ? (
    <div style={{ position:"relative", width: `${divWidth}${sizeString}`, height: `${divHeight}${sizeString}`, paddingRight: "30px" }}>
      <img
        src={avatarResponse.avatarShapeResponse.shapeUrl}
        alt={avatarResponse.avatarShapeResponse.shapeUrl}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: `${imgWidth}${sizeString}`,
          height: `${imgHeight}${sizeString}`,
          filter: "drop-shadow(3px 3px 1.8px #000)",
        }}
      ></img>
      <img
        src={avatarResponse.avatarClothesResponse.clothesUrl}
        alt={avatarResponse.avatarClothesResponse.clothesUrl}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: `${imgWidth}${sizeString}`,
          height: `${imgHeight}${sizeString}`,
        }}
      ></img>
      <img
        src={avatarResponse.avatarEyeResponse.eyeUrl}
        alt={avatarResponse.avatarEyeResponse.eyeUrl}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: `${imgWidth}${sizeString}`,
          height: `${imgHeight}${sizeString}`,
        }}
      ></img>
      <img
        src={avatarResponse.avatarMouthResponse.mouthUrl}
        alt={avatarResponse.avatarMouthResponse.mouthUrl}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: `${imgWidth}${sizeString}`,
          height: `${imgHeight}${sizeString}`,
        }}
      ></img>
      <img
        src={avatarResponse.avatarNoseResponse.noseUrl}
        alt={avatarResponse.avatarNoseResponse.noseUrl}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: `${imgWidth}${sizeString}`,
          height: `${imgHeight}${sizeString}`,
        }}
      ></img>
      {button ? (
        <Button
          style={{
            position: "absolute",
            top: top,
            left: left,
            width: `${imgWidth}${sizeString}`,
            height: `${imgHeight}${sizeString}`,
          }}
          onClick={props.onClick}
        >
          <img
            src={avatarResponse.avatarHairResponse.hairUrl}
            alt={avatarResponse.avatarHairResponse.hairUrl}
            style={{
              width: `${imgWidth}${sizeString}`,
              height: `${imgHeight}${sizeString}`,
            }}
          ></img>
        </Button>
      ) : (
        <img
          src={avatarResponse.avatarHairResponse.hairUrl}
          alt={avatarResponse.avatarHairResponse.hairUrl}
          style={{
            position: "absolute",
            top: top,
            left: left,
            width: `${imgWidth}${sizeString}`,
            height: `${imgHeight}${sizeString}`,
          }}
        ></img>
      )}
    </div>
  ) : (
    <div style={{ width: `${divWidth}${sizeString}`, height: `${divHeight}${sizeString}` }}></div>
  );
}