import styled from "styled-components";

export const WrapperHome = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 20px;

  .client-management {
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (max-width: 768px) {
      max-width: 100%;
    }
  }

  h2 {
    text-align: center;
    margin-bottom: 24px;
    color: #1890ff;
    font-size: 28px;
  }

  h3 {
    text-align: center;
    margin: 24px 0 16px;
    color: #1890ff;
    font-size: 20px;
  }

  .form-container {
    width: 100%;
    max-width: 600px;
    padding: 30px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    margin-bottom: 30px;

    @media (max-width: 768px) {
      max-width: 90%;
      padding: 20px;
    }
  }

  .table-container {
    width: 100%;
    max-width: 900px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    padding: 20px;

    @media (max-width: 768px) {
      max-width: 90%;
      padding: 15px;
      overflow-x: auto;
    }
  }

  .ant-form-item {
    margin-bottom: 16px;
  }

  .button-group {
    display: flex;
    justify-content: space-between;
    margin-top: 24px;

    @media (max-width: 480px) {
      flex-direction: column;
    }
  }

  .btn {
    min-width: 120px;
    height: 40px;
    font-size: 16px;

    @media (max-width: 480px) {
      width: 100%;
      margin-bottom: 12px;
    }
  }

  .submit {
    background-color: #52c41a;

    &:hover {
      background-color: #73d13d;
    }
  }

  .delete {
    background-color: #ff4d4f;

    &:hover {
      background-color: #ff7875;
    }
  }

  .back {
    &:hover {
      opacity: 0.8;
    }
  }

  .clickable-row {
    cursor: pointer;

    &:hover {
      background-color: #f0f7ff;
    }
  }
`;
