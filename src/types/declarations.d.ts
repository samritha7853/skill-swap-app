declare module 'react-native-vector-icons/MaterialCommunityIcons' {
  import { Component } from 'react';
  import { IconProps } from 'react-native-vector-icons/Icon';
  export default class Icon extends Component<IconProps> {}
}

declare module 'react-native-vector-icons/Icon' {
  import { Component } from 'react';
  import { TextProps, ViewStyle, TextStyle } from 'react-native';

  export interface IconProps extends TextProps {
    name: string;
    size?: number;
    color?: string;
    style?: ViewStyle | TextStyle;
  }

  export default class Icon extends Component<IconProps> {}
}
