import React, { useCallback, useEffect, useState } from 'react';
import { TextInput } from 'react-native';
import { View, TextProps } from 'react-native';
import { usernameExists } from '../api';
import { throttle } from 'lodash';
import Text from './Text';

interface Props {
  setValue: React.Dispatch<React.SetStateAction<string | undefined>>;
  value: string | undefined;
  setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
  isValid: boolean;
  className?: string | undefined;
  focusNext: Function;
}

export default function UsernameInput({ className, value, setValue, isValid, setIsValid, focusNext }: Props) {
  const [inFocus, setInFocus] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (value) validateUsername(value);
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [value]);

  const onChange = useCallback((text: string) => {
    setIsValid(false);
    setMessage('');
    setIsError(false);
    setValue(text);
  }, []);

  const validateUsername = useCallback((text: string) => {
    if (text.match('[^a-zA-Z0-9._\\-]')) {
      setMessage('Only dashes, underscores and dots');
      setIsError(true);
      return;
    }

    if (text !== undefined || text !== null) {
      checkUsernameExists(text);
    }
  }, []);

  const onFocus = () => {
    setInFocus(true);
  };

  const onBlur = () => {
    setInFocus(false);

    if (value === undefined || value.length === 0) {
      setIsError(true);
      setMessage('Field cannot be empty');
    }
  };

  const checkUsernameExists = useCallback(
    throttle((username: string) => {
      usernameExists(username)
        .then((res) => {
          console.log(res.status, res.data);
          if (res.status === 200) {
            setIsValid(true);
            setMessage('Username Available');
          }
        })
        .catch((error) => {
          if (error.response && error.response.status === 409) {
            setIsValid(false);
            setIsError(true);
            setMessage('Username Taken');
          }
        });
    }, 2000),
    []
  );

  const messageStyles = useCallback(() => {
    return isValid ? 'bg-success mb-2' : isError && message ? 'bg-danger mb-2' : 'bg-transparent';
  }, [isError, message]);

  return (
    <View className={className}>
      <Text className='mb-2 pl-4 text-xl font-bold text-themeText'>Username *</Text>
      <View className='flex flex-col items-center w-full'>
        <TextInput
          className={
            (isValid ? 'border-success' : isError ? 'border-danger' : inFocus ? 'border-themeActive' : 'border-transparent') +
            ' bg-themeInput border-[5px] shadow-sm shadow-themeShadow w-full rounded-3xl px-5 py-3 text-xl'
          }
          style={{ fontFamily: 'BalooChettan2-Regular' }}
          placeholderTextColor={'#444444bb'}
          value={value}
          onChangeText={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          autoCorrect={false}
          autoCapitalize={'none'}
          maxLength={30}
          placeholder='Enter your username'
          onSubmitEditing={() => {
            focusNext();
          }}
          blurOnSubmit={false}
          returnKeyType="next"
        />
        <View className={messageStyles() + ' rounded-b-xl px-3 pb-1 text-sm'}>
          <Text className='text-xs text-[#000000bb]'>{message}</Text>
        </View>
      </View>
    </View>
  );
}
