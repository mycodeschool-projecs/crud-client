import styled from "styled-components";

export const WrapperLogin = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f5f5;

  .login-container {
    width: 100%;
    max-width: 450px;
    padding: 30px;
    background-color: #ffffff;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    @media (max-width: 480px) {
      max-width: 90%;
      padding: 20px;
    }
  }

  h2 {
    text-align: center;
    margin-bottom: 24px;
    color: #1890ff;
    font-size: 24px;
  }

  .ant-form-item {
    margin-bottom: 16px;
  }

  .buttons {
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

  .back {
    &:hover {
      opacity: 0.8;
    }
  }
`;
