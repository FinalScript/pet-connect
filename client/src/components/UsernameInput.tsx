import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, TextInput, TextInputProps } from 'react-native';
import { View, TextProps } from 'react-native';
import Text from './Text';
import { useLazyQuery } from '@apollo/client';
import { OWNER_USERNAME_EXISTS } from '../graphql/Owner';
import { PET_USERNAME_EXISTS } from '../graphql/Pet';
import { useFirstRender } from '../hooks/useFirstRender';
import { Feather } from '../utils/Icons';

interface Props extends TextInputProps {
  setValue: Function;
  value: string | undefined;
  setIsValid: React.Dispatch<React.SetStateAction<boolean>>;
  isValid: boolean;
  className?: string | undefined;
  focusNext?: Function;
  forOwner?: boolean;
  prefix?: boolean;
  inputRef?: React.RefObject<TextInput>;
}

export default function UsernameInput({
  inputRef,
  className,
  value,
  setValue,
  isValid,
  setIsValid,
  focusNext,
  forOwner = false,
  prefix = false,
  ...rest
}: Props) {
  const [ownerUsernameExists] = useLazyQuery(OWNER_USERNAME_EXISTS);
  const [petUsernameExists] = useLazyQuery(PET_USERNAME_EXISTS);
  const [inFocus, setInFocus] = useState(false);
  const [isError, setIsError] = useState(false);
  const [message, setMessage] = useState('');
  const [isChecking, setChecking] = useState(false);
  const firstRender = useFirstRender();

  useEffect(() => {
    if (value && !firstRender) {
      setChecking(true);
    }

    const timeoutId = setTimeout(() => {
      // value === "" will prevent an infinite load from occuring when a username is entered then deleted quickly
      if (value && !firstRender) {
        validateUsername(value);
        setChecking(false);
      }
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

    if (text.trim().length !== 0 || text !== undefined || text !== null) {
      checkUsernameExists(text);
    }
  }, []);

  const onFocus = () => {
    setInFocus(true);
  };

  const onBlur = () => {
    setInFocus(false);

    if (value && value.trim().length !== 0) {
      checkUsernameExists(value);
    }

    if (isValid) {
      setMessage('');
    }
  };

  const checkUsernameExists = useCallback(
    async (username: string) => {
      if (forOwner) {
        const ownerUsername = await ownerUsernameExists({ variables: { username } });

        if (ownerUsername?.data?.validateUsername.isAvailable) {
          setIsValid(true);
          setMessage('Username Available');
          return;
        } else {
          setIsValid(false);
          setIsError(true);
          setMessage('Username Taken');
        }
      } else {
        const petUsername = await petUsernameExists({ variables: { username } });

        if (petUsername?.data?.validatePetUsername.isAvailable) {
          setIsValid(true);
          setMessage('Username Available');
          return;
        } else {
          setIsValid(false);
          setIsError(true);
          setMessage('Username Taken');
        }
      }
    },
    [forOwner]
  );

  const messageStyles = useCallback(() => {
    return isValid ? 'bg-success' : isError && message ? 'bg-danger' : 'bg-transparent';
  }, [isError, message]);

  return (
    <View className='flex flex-col items-center justify-center w-full relative'>
      <View className='flex flex-row items-center'>
        <View className='w-full relative flex-row items-center'>
          {prefix && (
            <View className='absolute z-10 left-5'>
              <Text className='text-lg'>@</Text>
            </View>
          )}
          <TextInput
            ref={inputRef}
            className={
              (isValid ? 'border-success' : isError ? 'border-danger' : inFocus ? 'border-themeActive' : 'border-transparent') +
              ' bg-themeInput border-[5px] text-themeText shadow-sm shadow-themeShadow w-full rounded-3xl px-5 py-3 pr-10 text-lg ' +
              (prefix && ' !pl-9 ') +
              className
            }
            style={{ fontFamily: 'BalooChettan2-Regular' }}
            placeholderTextColor={'#444444bb'}
            value={value}
            onChangeText={onChange}
            onFocus={onFocus}
            onBlur={onBlur}
            autoCorrect={false}
            autoCapitalize={'none'}
            onSubmitEditing={() => {
              if (focusNext) focusNext();
            }}
            {...rest}
          />
        </View>
        {isChecking && <ActivityIndicator className='absolute right-5' size='small' color={'#321411'} />}
      </View>
      {message && (
        <View className={messageStyles() + ' rounded-b-xl px-3 pb-1'}>
          <Text className='text-xs text-[#000000bb]'>{message}</Text>
        </View>
      )}
    </View>
  );
}
