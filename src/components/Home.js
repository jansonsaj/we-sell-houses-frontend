import React from 'react';

import {useTheme} from '../ThemeContext';

/**
 * Home page
 * @component
 * @return {JSX.Element}
 */
function Home() {
  const {theme} = useTheme();
  return (
    <h1>{theme}</h1>
  );
}

export default Home;
