import styled from "styled-components";

export const WrapperRegister = styled.div`

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
  height: 100%;
  overflow: unset;


  .frmr{
    width: 400px;
    height: 300px;
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
    //position: relative;
  }

  //.sect label{
  //  position: absolute;
  //  top: -22px;
  //  left: 5px;
  //  width: fit-content;
  //  background-color: #ddebef ;
  //}
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