import styled from "styled-components";

export const WrapperLogin = styled.div`

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
  height: 100%;
  overflow: unset;


  .frm {
    width: 400px;
    height: 200px;
    background-color: #ddebef;
    display: flex;
    flex-direction: column;
    padding-top: 30px;
  }

  .sect {
    width: 100%;
    display: flex;
    align-items: flex-start;
    height: auto;
  }

  .buttons {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn {
    margin: 10px;
    width: 150px;
    height: 40px;
    font-size: 15px;
  }

  .back {
    background-color: #424854;
  }

  label {
    width: 43%;
    margin-left: 10px;
    margin-top: 18px;

    font-size: 18px;
    line-height: 19px;
  }

  .camp {
    width: 95%;
    height: 35px;
    border-radius: 3px;
    margin: 10px 10px;
    box-sizing: border-box;
    border: none;
  }

  .submit {
    background-color: darkgreen;
  }

`