import styled from "styled-components";

export const WrapperLanding = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  height: 100vh;
  overflow: unset;
  background-color: #f5f5f5;

  .welcome-section {
    text-align: center;
    max-width: 800px;
    padding: 30px;
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .description {
    margin-bottom: 30px;
    font-size: 16px;
    color: #666;
  }

  .button-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
  }

  .button {
    min-width: 200px;
    height: 50px;
    margin: 10px;
    font-weight: 500;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
  }

  .button:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .login {
    background-color: #ff4d4f;
    border-color: #ff4d4f;
  }

  .reg {
    background-color: #1890ff;
    border-color: #1890ff;
  }

  @media (max-width: 768px) {
    .button-container {
      flex-direction: column;
    }
  }
`;
