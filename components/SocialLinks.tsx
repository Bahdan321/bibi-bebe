import React from 'react';
import { View, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/providers/ThemeProvider';
import CustomTouchable from '@/components/base/CustomTouchable';

type SocialType = 'telegram' | 'twitter' | 'tiktok' | 'youtube';

type SocialLink = { type: SocialType; url: string };

type SocialLinksProps = {
  links?: SocialLink[];
  size?: number;
  spacing?: number;
};

const DEFAULT_LINKS: SocialLink[] = [
  { type: 'telegram', url: 'https://t.me/bibibebeapp' },
  { type: 'twitter', url: 'https://twitter.com/bibibebeapp' },
  { type: 'tiktok', url: 'https://www.tiktok.com/@bibibebeapp' },
  { type: 'youtube', url: 'https://www.youtube.com/@bibibebeapp' },
];

const iconNameFor = (type: SocialType) => {
  switch (type) {
    case 'telegram':
      return 'paper-plane';
    case 'twitter':
      return 'logo-twitter';
    case 'tiktok':
      return 'logo-tiktok';
    case 'youtube':
      return 'logo-youtube';
    default:
      return 'link';
  }
};

const SocialLinks: React.FC<SocialLinksProps> = ({ links = DEFAULT_LINKS, size = 24, spacing = 12 }) => {
  const { theme } = useTheme();

  const open = async (url: string) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) await Linking.openURL(url);
    } catch {
    }
  };

  return (
    <View style={{ flexDirection: 'row' }}>
      {links.map((item, idx) => (
        <CustomTouchable
          key={`${item.type}-${idx}`}
          style={{ marginRight: idx < links.length - 1 ? spacing : 0 }}
          onPress={() => open(item.url)}
        >
          <Ionicons name={iconNameFor(item.type) as any} size={size} color={theme.colors.button} />
        </CustomTouchable>
      ))}
    </View>
  );
};

export default SocialLinks;