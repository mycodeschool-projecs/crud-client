import styled from "styled-components";

export const WrapperHome = styled.div`

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 20px;
  height: 100%;
  overflow: unset;

  .tbl {
    margin-top: 20px;
    width: 500px;
    height: 200px;
  }

  Form {
    padding-top: 20px;
    background-color: wheat;
    display: flex;
    flex-direction: column;
    //align-items: start;
    justify-content: flex-start;
    //justify-content: start;
  }

  .buttons {
    display: flex;

  }
  .back{
    background-color: #282c34;
    width: 90px;
  }

  .ant-col.ant-form-item-control {
    margin-right: 20px;
  }

  label {
    width: 100%;
    text-align: left;
    margin-left: 20px;
  }

  .ant-col.ant-form-item-label {
    width: 200px;
  }

  .btn.delete {
    background-color: red;
  }


  //.custom-tbl th{
  //  background-color: #5b8cb7 !important; /* Exemplu de culoare */
  //  color: #000; /* Culoarea textului */
  //}
  //
  //.custom-tbl-header th {
  //  font-weight: bold;
  //}
  //
  .custom-tbl tbody .ant-table-cell{
    height: 40px;
    padding: 10px;
  }
  //.custom-tbl tbody tr{
  //  font-weight: bold;
  //  background-color: wheat;
  //}

  //
  .spinner{ 
    position: absolute;
    
    //top: 30px;
    //left:30px;
    z-index: 200;
    width: 90px;
    height: 90px;

  }
  
  svg.spinner path{
    fill: rgba(123,123,123,.5) !important;
    stroke: rgba(123,123,123,.5) !important;
  }

  
  
`