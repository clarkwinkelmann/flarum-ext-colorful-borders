# Colorful Borders

Mess up with each individual post styling.

This is this year's April Fools extension from Clark.
It's not supposed to be useful, but you can use it to let moderators customize their or other's posts.
Or go big, and let anyone customize anything for a while.

![Style editor and preview](https://i.imgur.com/HGgfrOZ.png)

![Settings modal](https://i.imgur.com/1aWCszy.png)

Available permissions:

- Edit own post styling
- Edit any post styling

Available settings:

- Customizable border color
- Customizable background color
- Customizable text color
- Customizable border width
- Customizable border radius

For each color setting, you can choose between an included small palette of colors, any color via the browser color picker, or a list of admin-provided colors inputted as hexadecimal or RGB values.

For each range setting, you can choose the minimum and maximum value allowed.
The values are in pixels.

For each option, the editor allows selecting "Default".
This will use the inherited value (i.e., not apply any direct styling).
Those default values are:

- Border color: transparent (set by this extension)
- Background color: none (Flarum's page background is visible through, changes depending on the theme)
- Text color: Flarum's text color (changes depending on the theme)
- Border width: 5px (set by this extension)
- Border radius: Flarum's default border radius (set by Flarum even though it's generally not visible)

You can customize those default styles via the custom CSS field of Flarum.

If you want to reset all posts to the default style, you can run the following commands to remove the `colorful_borders_style` column from the database and re-add it:

    php flarum migrate:reset --extension=clarkwinkelmann-colorful-borders
    php flarum migrate

## Installation

This extension requires **MySQL 5.7.8+ or MariaDB 10.2.7+** due to the use of the `JSON` data type!

    composer require clarkwinkelmann/flarum-ext-colorful-borders

## Links

- [GitHub](https://github.com/clarkwinkelmann/flarum-ext-colorful-borders)
- [Packagist](https://packagist.org/packages/clarkwinkelmann/flarum-ext-colorful-borders)
- [Discuss](https://discuss.flarum.org/d/23303)
