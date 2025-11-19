import React, { createContext, useContext, useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useTheme } from '@/providers/ThemeProvider';
import { LAYOUT_CONSTANTS } from '@/constants/layout';
import { getFrameEnabled } from '@/storages/frameStorage';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Insets = { horizontal: number; top: number; bottom: number };

type FrameConfig = {
  insets: Insets;
  radius: number;
  fillColor: string;
  borderColor: string;
  enabled: boolean;
};

type AnimateOpts = { duration?: number };

type ScreenFrameController = {
  setInsets: (insets: Partial<Insets>, animated?: boolean, opts?: AnimateOpts) => void;
  setRadius: (radius: number, animated?: boolean, opts?: AnimateOpts) => void;
  setFillColor: (color: string) => void;
  setBorderColor: (color: string) => void;
  enable: (flag: boolean, animated?: boolean, opts?: AnimateOpts) => void;
  animateTo: (cfg: Partial<FrameConfig>, opts?: AnimateOpts) => void;
  reset: (animated?: boolean, opts?: AnimateOpts) => void;
};

const ScreenFrameContext = createContext<ScreenFrameController | null>(null);

export const useScreenFrame = () => {
  const ctx = useContext(ScreenFrameContext);
  if (!ctx) throw new Error('useScreenFrame must be used within ScreenFrame');
  return ctx;
};

type Props = {
  children: React.ReactNode;
  initial?: Partial<FrameConfig>;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
};

export const ScreenFrame: React.FC<Props> = ({ children, initial, style, contentContainerStyle }) => {
  const { theme } = useTheme();
  const insetsSafe = useSafeAreaInsets();

  const initialConfig: FrameConfig = {
    insets: {
      horizontal: initial?.insets?.horizontal ?? LAYOUT_CONSTANTS.horizontalPadding,
      top: initial?.insets?.top ?? LAYOUT_CONSTANTS.marginTop,
      bottom: initial?.insets?.bottom ?? LAYOUT_CONSTANTS.marginBottom,
    },
    radius: initial?.radius ?? LAYOUT_CONSTANTS.borderRadius,
    fillColor: initial?.fillColor ?? theme.colors.secondary,
    borderColor: initial?.borderColor ?? theme.colors.background,
    enabled: initial?.enabled ?? true,
  };

  const insetsH = useSharedValue(initialConfig.insets.horizontal);
  const insetsT = useSharedValue(initialConfig.insets.top);
  const insetsB = useSharedValue(initialConfig.insets.bottom);
  const radius = useSharedValue(initialConfig.radius);
  const enabled = useSharedValue(initialConfig.enabled ? 1 : 0);
  const fillColor = useSharedValue(initialConfig.fillColor);
  const borderColor = useSharedValue(initialConfig.borderColor);

  const outerStyle = useAnimatedStyle(() => ({
    flex: 1,
    backgroundColor: borderColor.value,
  }));

  const innerStyle = useAnimatedStyle(() => ({
    flex: 1,
    marginHorizontal: insetsH.value * enabled.value,
    marginTop: insetsT.value * enabled.value,
    marginBottom: insetsB.value * enabled.value,
    paddingTop: insetsSafe.top * (1 - enabled.value),
    paddingBottom: insetsSafe.bottom * (1 - enabled.value),
    borderRadius: radius.value * enabled.value,
    backgroundColor: enabled.value < 0.5 ? theme.colors.primary : fillColor.value,
    overflow: 'hidden',
  }));

  const d = (opts?: AnimateOpts) => ({ duration: opts?.duration ?? 250 });

  const controller: ScreenFrameController = ({
    setInsets: (ins, animated = true, opts) => {
      if (ins.horizontal !== undefined) {
        insetsH.value = animated ? withTiming(ins.horizontal, d(opts)) : ins.horizontal;
      }
      if (ins.top !== undefined) {
        insetsT.value = animated ? withTiming(ins.top, d(opts)) : ins.top;
      }
      if (ins.bottom !== undefined) {
        insetsB.value = animated ? withTiming(ins.bottom, d(opts)) : ins.bottom;
      }
    },
    setRadius: (r, animated = true, opts) => {
      radius.value = animated ? withTiming(r, d(opts)) : r;
    },
    setFillColor: (c) => {
      fillColor.value = c;
    },
    setBorderColor: (c) => {
      borderColor.value = c;
    },
    enable: (flag, animated = true, opts) => {
      const v = flag ? 1 : 0;
      enabled.value = animated ? withTiming(v, d(opts)) : v;
    },
    animateTo: (cfg, opts) => {
      if (cfg.insets) {
        const x = cfg.insets;
        if (x.horizontal !== undefined) insetsH.value = withTiming(x.horizontal, d(opts));
        if (x.top !== undefined) insetsT.value = withTiming(x.top, d(opts));
        if (x.bottom !== undefined) insetsB.value = withTiming(x.bottom, d(opts));
      }
      if (cfg.radius !== undefined) radius.value = withTiming(cfg.radius, d(opts));
      if (cfg.fillColor !== undefined) fillColor.value = cfg.fillColor;
      if (cfg.borderColor !== undefined) borderColor.value = cfg.borderColor;
      if (cfg.enabled !== undefined) enabled.value = withTiming(cfg.enabled ? 1 : 0, d(opts));
    },
    reset: (animated = true, opts) => {
      const apply = (val: number) => (animated ? withTiming(val, d(opts)) : val);
      insetsH.value = apply(initialConfig.insets.horizontal);
      insetsT.value = apply(initialConfig.insets.top);
      insetsB.value = apply(initialConfig.insets.bottom);
      radius.value = apply(initialConfig.radius);
      enabled.value = apply(initialConfig.enabled ? 1 : 0);
      fillColor.value = initialConfig.fillColor;
      borderColor.value = initialConfig.borderColor;
    },
  });

  useEffect(() => {
    (async () => {
      const stored = await getFrameEnabled();
      if (stored !== null) {
        enabled.value = stored ? 1 : 0;
      }
    })();
  }, [enabled]);

  return (
    <ScreenFrameContext.Provider value={controller}>
      <Animated.View style={[{ flex: 1 }, outerStyle, style]}>
        <Animated.View style={[innerStyle, contentContainerStyle]}>
          {children}
        </Animated.View>
      </Animated.View>
    </ScreenFrameContext.Provider>
  );
};