import styled from 'styled-components'

export const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`

export const Header = styled.header`
  text-align: center;
  margin-bottom: 2rem;
  color: white;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    font-weight: 700;
  }

  p {
    font-size: 1.1rem;
    opacity: 0.9;
  }
`

export const Progress = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  gap: 1rem;

  .step {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;

    &-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      background: ${props => props.theme.colors.primary};
      color: white;
      border: 2px solid white;

      &.active {
        background: white;
        color: ${props => props.theme.colors.primary};
      }

      &.completed {
        background: #10b981;
        color: white;
      }
    }

    &-label {
      font-size: 0.9rem;
      color: white;
      font-weight: 500;
    }
  }

  .connector {
    width: 60px;
    height: 2px;
    background: rgba(255, 255, 255, 0.3);
    margin: 0 0.5rem;
    align-self: center;

    &.active {
      background: white;
    }
  }
`

export const StepContainer = styled.div`
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);

  h2 {
    color: ${props => props.theme.colors.primary};
    margin-bottom: 1.5rem;
    text-align: center;
    font-size: 1.8rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    label {
      font-weight: 600;
      color: #374151;
      font-size: 0.9rem;
    }

    input, select, textarea {
      padding: 0.75rem;
      border: 2px solid #e5e7eb;
      border-radius: 8px;
      font-size: 1rem;
      transition: all 0.2s;

      &:focus {
        outline: none;
        border-color: ${props => props.theme.colors.primary};
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
      }

      &.error {
        border-color: #ef4444;
      }
    }

    span.error {
      color: #ef4444;
      font-size: 0.8rem;
      font-weight: 500;
    }
  }

  .file-upload {
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      border-color: ${props => props.theme.colors.primary};
      background: rgba(102, 126, 234, 0.05);
    }

    &.dragover {
      border-color: ${props => props.theme.colors.primary};
      background: rgba(102, 126, 234, 0.1);
    }

    input[type="file"] {
      display: none;
    }

    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;

      svg {
        color: #6b7280;
        font-size: 2rem;
      }

      p {
        color: #6b7280;
        font-weight: 500;

        strong {
          color: ${props => props.theme.colors.primary};
        }
      }

      .file-info {
        background: #f3f4f6;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        margin-top: 1rem;

        span {
          color: #374151;
          font-weight: 500;
        }

        .file-size {
          color: #6b7280;
          font-size: 0.8rem;
        }
      }
    }
  }

  .terms {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    margin: 1.5rem 0;

    input[type="checkbox"] {
      margin-top: 0.25rem;
    }

    label {
      font-size: 0.9rem;
      color: #374151;
      line-height: 1.4;

      a {
        color: ${props => props.theme.colors.primary};
        text-decoration: none;
        font-weight: 600;

        &:hover {
          text-decoration: underline;
        }
      }
    }
  }

  .error-message {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      background: none;
      border: none;
      color: #dc2626;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        opacity: 0.7;
      }
    }
  }

  @media (max-width: 768px) {
    padding: 1.5rem;

    .form-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    h2 {
      font-size: 1.5rem;
    }
  }
`

export const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-top: 2rem;

  button {
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    &.back {
      background: #f3f4f6;
      color: #374151;

      &:hover:not(:disabled) {
        background: #e5e7eb;
      }
    }

    &.next {
      background: ${props => props.theme.colors.primary};
      color: white;

      &:hover:not(:disabled) {
        background: #5a67d8;
      }
    }

    &.submit {
      background: #10b981;
      color: white;

      &:hover:not(:disabled) {
        background: #059669;
      }
    }
  }

  @media (max-width: 768px) {
    flex-direction: column-reverse;

    button {
      width: 100%;
      justify-content: center;
    }
  }
`