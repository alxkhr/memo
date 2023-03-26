import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { generateMemoId } from "../memo/generate-memo-id";

export function AppHeader() {
  const navigate = useNavigate();
  function onClickNew(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    navigate(`/note/${generateMemoId()}`);
  }
  return (
    <div>
      <h1>Headnut</h1>
      <p>
        <Link to="/">Notes</Link>&nbsp;|&nbsp;
        <Link to="/connect">Connect</Link>&nbsp;|&nbsp;
        <button onClick={onClickNew}>New</button>
      </p>
    </div>
  );
}
