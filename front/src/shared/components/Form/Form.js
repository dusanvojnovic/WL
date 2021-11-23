import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Button from '../UIElements/Button';
import Input from './Input';
import LoadingSpinner from '../UIElements/LoadingSpinner';
import Modal from '../UIElements/Modal';
import { useHttpClient } from '../../hooks/http-hook';
import useForm from '../../hooks/form-hook';
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from '../../validators/validators';
import { AuthContext } from '../../context/auth-context';

import classes from './Form.module.css';

const Form = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const authCtx = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const history = useHistory();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: '',
        isValid: false,
      },
      password: {
        value: '',
        isValid: false,
      },
    },
    false
  );

  const formSubmitHandler = async (event) => {
    event.preventDefault();

    if (isLoginMode) {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/login',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          { 'Content-Type': 'application/json' }
        );
        authCtx.login(responseData.id, responseData.token);
        history.push(`/`);
      } catch (err) {}
    } else {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/users/signup',
          'POST',
          JSON.stringify({
            email: formState.inputs.email.value,
            username: formState.inputs.username.value,
            password: formState.inputs.password.value,
            confirmedPassword: formState.inputs.confirmedPassword.value,
          }),
          { 'Content-Type': 'application/json' }
        );
        authCtx.login(responseData.userId, responseData.token);
        history.push(`/`);
      } catch (err) {}
    }
  };

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          username: undefined,
          confirmedPassword: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          username: {
            value: '',
            isValid: false,
          },
          confirmedPassword: {
            value: '',
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((previousMode) => !previousMode);
  };

  return (
    <>
      {error && (
        <Modal show header="An Error Occured!" onClick={clearError}>
          {error}
        </Modal>
      )}
      <div className={classes.formContainer}>
        {isLoading && <LoadingSpinner asOverlay />}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.formSubmitHandler();
          }}
        >
          <div className={classes.formInputs}>
            <label htmlFor="userEmail">Email</label>
            <Input
              id="email"
              type="email"
              validators={[VALIDATOR_EMAIL()]}
              errorText="Please enter a valid email address."
              onInput={inputHandler}
            />
          </div>
          {!isLoginMode && (
            <div className={classes.formInputs}>
              <label htmlFor="password">Username</label>
              <Input
                id="username"
                type="text"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please enter a username."
                onInput={inputHandler}
              />
            </div>
          )}
          <div className={classes.formInputs}>
            <label htmlFor="password">Password</label>
            <Input
              id="password"
              type="password"
              validators={[VALIDATOR_MINLENGTH(6)]}
              errorText="Please enter a valid password (at least 6 characters). "
              onInput={inputHandler}
            />
          </div>
          {!isLoginMode && (
            <div className={classes.formInputs}>
              <label htmlFor="password">Confirm Password</label>
              <Input
                id="confirmedPassword"
                type="password"
                validators={[VALIDATOR_REQUIRE()]}
                errorText="Please confirm your password."
                onInput={inputHandler}
              />
            </div>
          )}
          <Button onClick={formSubmitHandler} disabled={!formState.isValid}>
            {isLoginMode ? 'LOGIN' : 'SIGNUP'}
          </Button>
        </form>
        <Button onClick={switchModeHandler}>
          SWITCH TO {isLoginMode ? 'SIGNUP' : 'LOGIN'}
        </Button>
      </div>
    </>
  );
};

export default Form;
