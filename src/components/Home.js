import React from 'react';

import {useTheme} from '../ThemeContext';

/**
 * Home page
 * @return {JSX.Element}
 */
function Home() {
  const {theme} = useTheme();
  return (
    <h1>{theme}</h1>
  );
}

export default Home;
