import { Box } from "@mui/system";
import React, { useEffect } from "react";

export default function CommentCount({ listSize }) {
  return (
    <Box fontStyle={"oblique"} fontSize="15px" margin={"10px"}>
      댓글({listSize})
    </Box>
  );
}
