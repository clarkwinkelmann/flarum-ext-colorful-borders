<?php

namespace ClarkWinkelmann\ColorfulBorders\Extenders;

use ClarkWinkelmann\ColorfulBorders\DefaultPalettes;
use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Extension\Extension;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Container\Container;

class ForumAttributes
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(Serializing::class, [$this, 'attributes']);
    }

    public function attributes(Serializing $event)
    {
        if ($event->serializer instanceof ForumSerializer) {
            /**
             * @var $settings SettingsRepositoryInterface
             */
            $settings = app(SettingsRepositoryInterface::class);

            $event->attributes += [
                'colorful-borders.enableBackgroundColor' => (bool)$settings->get('colorful-borders.enableBackgroundColor', false),
                'colorful-borders.backgroundColors' => $this->colors($settings, 'backgroundColors'),
                'colorful-borders.enableBorderColor' => (bool)$settings->get('colorful-borders.enableBorderColor', true),
                'colorful-borders.borderColors' => $this->colors($settings, 'borderColors'),
                'colorful-borders.enableTextColor' => (bool)$settings->get('colorful-borders.enableTextColor', false),
                'colorful-borders.textColors' => $this->colors($settings, 'textColors'),
                'colorful-borders.enableBorderWidth' => (bool)$settings->get('colorful-borders.enableBorderWidth', true),
                'colorful-borders.borderWidthMin' => (int)$settings->get('colorful-borders.borderWidthMin') ?: 1,
                'colorful-borders.borderWidthMax' => (int)$settings->get('colorful-borders.borderWidthMax') ?: 10,
                'colorful-borders.enableBorderRadius' => (bool)$settings->get('colorful-borders.enableBorderRadius', true),
                'colorful-borders.borderRadiusMin' => (int)$settings->get('colorful-borders.borderRadiusMin') ?: 1,
                'colorful-borders.borderRadiusMax' => (int)$settings->get('colorful-borders.borderRadiusMax') ?: 10,
            ];
        }
    }

    protected function colors(SettingsRepositoryInterface $settings, $key)
    {
        $value = $settings->get('colorful-borders.' . $key, 'simple');

        if ($value === 'all') {
            return 'all';
        }

        if ($value === 'simple') {
            return DefaultPalettes::{$key}();
        }

        return explode(',', $value);
    }
}
