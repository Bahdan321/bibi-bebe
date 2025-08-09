import { useCallback } from 'react'
const memes = [
    require('@/assets/images/memes/meme1.jpg'),
    require('@/assets/images/memes/meme2.jpg'),
    require('@/assets/images/memes/meme3.jpg'),
    require('@/assets/images/memes/meme4.jpg'),
    require('@/assets/images/memes/meme5.jpg'),
    require('@/assets/images/memes/meme6.jpg'),
    require('@/assets/images/memes/meme7.jpg'),
    require('@/assets/images/memes/meme8.jpg'),
    require('@/assets/images/memes/meme9.jpg'),
    require('@/assets/images/memes/meme10.jpg'),
    require('@/assets/images/memes/meme11.jpg'),
    require('@/assets/images/memes/meme12.jpg'),
    require('@/assets/images/memes/meme13.jpg'),
    require('@/assets/images/memes/meme14.jpg'),
    require('@/assets/images/memes/meme15.jpg'),
    require('@/assets/images/memes/meme16.jpg'),
    require('@/assets/images/memes/meme17.jpg'),
    require('@/assets/images/memes/meme18.jpg'),
    require('@/assets/images/memes/meme19.jpg'),
    require('@/assets/images/memes/meme20.jpg'),
    require('@/assets/images/memes/meme21.jpg'),
    require('@/assets/images/memes/meme22.jpg'),
    require('@/assets/images/memes/meme23.jpg'),
    require('@/assets/images/memes/meme24.jpg'),
    require('@/assets/images/memes/meme25.jpg'),
    require('@/assets/images/memes/meme26.jpg'),
    require('@/assets/images/memes/meme27.jpg'),
    require('@/assets/images/memes/meme28.jpg'),
    require('@/assets/images/memes/meme29.jpg'),
    require('@/assets/images/memes/meme30.jpg'),
    require('@/assets/images/memes/meme31.jpg'),
    require('@/assets/images/memes/meme32.jpg'),
    require('@/assets/images/memes/meme33.jpg'),
    require('@/assets/images/memes/meme34.jpg'),
    require('@/assets/images/memes/meme35.jpg'),
    require('@/assets/images/memes/meme36.jpg'),
    require('@/assets/images/memes/meme37.jpg'),
    require('@/assets/images/memes/meme38.jpg'),
];

const useRandomMeme = () => {
    return useCallback(() => {
        const randomIndex = Math.floor(Math.random() * memes.length);
        return memes[randomIndex];
    }, []);
};

export default useRandomMeme