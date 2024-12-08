import { Button } from "frames.js/next";
import { frames } from "./frames";

const handleRequest = frames(async (ctx) => {

  return {
    image: "https://i.postimg.cc/5t4gdM0Q/HH.png",
    buttons: [
      <Button
        action='post'
        target={`/deposit`}
        key={"deposit"}
      >
        Deposit
      </Button>,
      <Button
        action='post'
        target={`/withdraw`}
        key={"withdraw"}
      >
        Withdraw
      </Button>,
      <Button
        action="link"
        target= "https://google.com"
      >
        google
      </Button>
    ],
  };
});

export const GET = handleRequest;
export const POST = handleRequest;
