import React from 'react';

import {useTheme} from '../ThemeContext';

/**
 * Navigation bar
 * @return {JSX.Element}
 */
function Home() {
  const {theme} = useTheme();
  return (
    <h1>{theme}</h1>
  );
}

export default Home;
