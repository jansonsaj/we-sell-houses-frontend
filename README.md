# We Sell Houses (Frontend)

We Sell Houses is a Single Page Application (SPA) created with React. It allows users (estate agents) to list houses for sale to the general public. Used together with [we-sell-houses-backend](https://github.com/jansonsaj/we-sell-houses-backend)

## Initial setup

1. Clone this repository.
1. Install all dependencies with `yarn install` or `npm install`.

## Running the app

1. To run the app in development mode, run `yarn start` or `npm start`.
1. The app will be accesible by navigating to [http://localhost:3000](http://localhost:3000) in the browser.
1. The page will automatically reload if you make edits.
1. You will also see any lint errors in the console.

## Testing the app

1. Run `yarn test` or `npm test`.
1. The test results will be visible in the console.

## Documentation

The code is documented using JSDoc with the addition of better-docs plugin. This allows the documentation to be organised based on components and provides a nicer user interface.

To access the documentation:
1. Run `yarn docs` or `npm run docs`.
1. The documentation will be generated in [/docs](/docs) directory.
1. Open the [/docs/index.html](/docs/index.html) with any browser and start exploring.

## Building the app

1. Run `yarn build` or `npm run build`.
1. It will bundle the SPA in production mode and optimize it for best performance. See [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
1. The built files will be located in [/build](/build) directory.

## Configuration

- To configure the base URL of the backend API, modify [.env](.env) file.
- Since this app was created using [Create React App](https://create-react-app.dev/), all the webpack and other related configuration has been encapsulated. It can be accessed directly by running `yarn eject`, however this would add many files to the source control and would make maintainability much harder. Instead I am using [react-app-rewired](https://github.com/timarney/react-app-rewired) which only exposes a single [config-overrides.js](config-overrides.js) that allows to configure webpack config in a much cleaner way.

## Component breakdown

The following is a list of components included in the app and their screenshots.

### Property tile - [src/components/PropertyTile.js](src/components/PropertyTile.js)
> ![Property Tile](/images/PropertyTile.png)
> ![Property Tile High priority](/images/PropertyTileHighPriority.png)
- Displays the title;
- Displays the type;
- Displays the first 200 characters of the description with an ellipsis (...) at the end;
- Displays the relative time from now when the property was listed;
- Displays the thumbnail image (if there is one);
- Displays the asking price with a thousand separator (,) or "Contact seller for price" when the price is 0 or not specified;
- High priority items will "pop-out" more and have a larger image.

### Property filter - [src/components/PropertyFilter.js](src/components/PropertyFilter.js)
> ![Property Filter](/images/PropertyFilter.gif)
- Filters are expandable;
- Filters can be mixed together and blank filters are ignored;
- Setting only min price will find all properties above the price and vice versa for max price. Setting both prices will find properties between the prices;
- You can sort by `Listed time`, `Price` and `Type` and change sort direction;
- You can search by postcosde, town and county. You can also search by only the first part of the postcode;
- Text search searches inside title, description and features;
- You can exclude under offer;
- If the user is logged in, they will have an additional filter to only show properties listed by them;
- Providing an invalid filter will display an alert message.

### Properties - [src/components/Properties.js](src/components/Properties.js)
> ![Properties](/images/Properties.png)
- Displays **Property Filters**;
- Displays pagination and total number of properties found;
- Displays **Property Tiles** in a list;
- Stores and extracts the **Property Filters** from the URL as query parameters: `http://localhost:3000/properties?page=1&resultsPerPage=1&sort=price&sortDirection=asc&search=Shower&status=listed&priceLow=100&priceHigh=500000&town=Huntingdon&county=Cambridgeshire&postcode=PE29`. This allows them to be shared and bookmarked.

### Carousel - [src/components/Carousel.js](src/components/Carousel.js)
> ![Carousel](/images/Carousel.gif)
- Carousel can display both images and videos;
- Images can be zoomed in and rotated.

### Property - [src/components/Property.js](src/components/Property.js)
> ![Property Top User](/images/PropertyTopUser.png)
> ![Property Top Guest](/images/PropertyTopGuest.png)
- At the top of the property page there is a back button, title and actions;
- When signed in and viewing a property uploaded by self, the actions contain: **Edit property** and **Delete property**;
- When viewing a property uploaded by someone else, the actions include: **Message property owner**.

> ![Property Bot Info](/images/PropertyBotInfo.png)
> ![Property Bot Location](/images/PropertyBotLocation.png)
- At the bottom of the property page there are 2 tabs: **Info** and **Location**;
- The **Info** tab shows:
    - The price with a thousand separator;
    - The property type;
    - The status (listed, under offer, archived);
    - Priority (normal, high);
    - Title;
    - A list of features;
    - Description and conserves white space;
    - When it was listed relative to current time;
    - When it was last updated relative to current time (if it hasn't been updated, this is hidden).
- The **Location** tab shows the address of the property and hiding any empty fields.
- At the bottom of the card are the same actions as on the top, but using icons and tooltips.

### New Property - [src/components/NewProperty.js](src/components/NewProperty.js)
> ![NewProperty](/images/NewProperty.gif)
- If you are logged in, you can create a new property listing;
- You can add videos and images;
- You can choose from a list of types;
- You can choose any number of predefined features or add your own;
- As you type the asking price, the thousand separators will automatically be added;
- Description expands as you type. Whitespace will be preserved;
- Address line supports auto fill and validated data according to the UK address standard;
- When you successfully add the property, you are automatically redirected to its detail page.

### Update Property - [src/components/UpdateProperty.js](src/components/UpdateProperty.js)
> ![UpdateProperty](/images/UpdateProperty.png)
- When editing the property, you can update all of its details;
- You can add and remove videos and pictures;
- You can change the status to `listed`, `under offer` or `archived`.

### New Message - [src/components/NewMessage.js](src/components/NewMessage.js)
> ![NewMessage](/images/NewMessage.gif)
- You can message any property owner;
- Requires a valid email address;
- Optionally can provide a phone number;
- Requires a message and the message box expands as you write.

> ![NewMessageWarning](/images/NewMessageWarning.png)
- The property the message is about is specified in the URL as query parameter `http://localhost:3000/new-message?propertyId=5fcd08ca8ef2b602aab909a6`.
- If this parameter is missing, a warning message is displayed.

### Register - [src/components/Register.js](src/components/Register.js)
> ![Register](/images/Register.gif)
- You can register if you have a valid sign-up code;
- You need to enter a valid email address that is not already in use;
- You need to enter a password that is at least 6 characters long;
- You need to confirm the password by entering it again;
- When an account is created, the user is redirected to the sign in page.

### Sign In - [src/components/SignIn.js](src/components/SignIn.js)
> ![SignIn](/images/SignIn.png)
- You can sign in if you have account;
- The screen has links to the register page;
- If you tried accessing a protected route, you will be redirected to sign in and on successful sign in you will be redirected back to the protected route. Otherwise you will be redirected to the home page.

### Header - [src/components/Header.js](src/components/Header.js) and Navbar - [src/components/Navbar.js](src/components/Navbar.js)
> ![HeaderGuest](/images/HeaderGuest.gif)
- The header contains the logo and a navigation bar;
- Anyone can access **Properties** and **Sign in** pages;
- Anyone can choose to use **Light** or **Dark** theme from the settings. The selected theme is remembered for each user in Local Storage.

> ![HeaderUser](/images/HeaderUser.png)
- Signed in users can access protected pages: **New Property** and **Messages**;
- Messages tab in the navigation bar contains a badge with the unread message count;

> ![HeaderSmall](/images/HeaderSmall.png)
- When the viewport becomes smaller and can't fit all the navigation items, they are collapsed into a submenu.

### Message Tile - [src/components/MessageTile.js](src/components/MessageTile.js)
> ![MessageTile](/images/MessageTile.png)
- Displays the sender's email as title. If the message is unread, the email is displayed as bold;
- Displays the message body with compressed white space. If the body is longer than 100 characters, only the first 100 characters are shown with an ellipsis (...) at the end;
- If the message is unread, it displays envelope icon;
- If the message is read, it displays book icon;
- If the message is archived, it displays folder icon;

### Message filter - [src/components/MessageFilter.js](src/components/MessageFilter.js)
> ![MessageFilter](/images/MessageFilter.gif)
- Filters are expandable;
- Filters can be mixed together and blank filters are ignored;
- Messages can be filtered based on their status;
- You can provide a property ID to only show messages regarding that property;
- Providing an invalid filter will display an alert message.

### Messages - [src/components/Messages.js](src/components/Messages.js)
> ![Messages](/images/Messages.gif)
- Messages component combines **Message Filter** with a list of **Message Tiles** and pagination;
- Has a custom hower effect.

### Message - [src/components/Message.js](src/components/Message.js)
> ![Message](/images/Message.png)
- When opened, changed the message's status to read;
- Shows a back button;
- Shows actions that can be performed on the message: **Archive**/**Unarchive** and **Delete**;
- Shows the **Property tile** for which the message was sent. It can be clicked to go to the property details page;
- Shows the sender's email and phone number if it was specified;
- Shows the message preserving white space;
- Shows when the message was received relative to now and when it's status was last changed.

> ![MessageError](/images/MessageError.png)
- The message gets its ID from the URL `http://localhost:3000/messages/5fce32d0f5af0202369d7e012`;
- If a message doesn't exist with the provided ID, an alert is displayed.

### Skeleton
> ![Skeleton](/images/Skeleton.png)
- When any page is retrieving the necessary data from the API, a Skeleton is displayed;

### Delete Popconfirm
> ![DeleteConfirm](/images/DeleteConfirm.png)
- When clicking **Delete** button on a property or a message, you will get a confirmation dialog. This protects from acciedental deletes.