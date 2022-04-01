<?php

namespace ClarkWinkelmann\ColorfulBorders;

use Flarum\Settings\SettingsRepositoryInterface;

class ForumAttributes
{
    protected $settings;

    public function __construct(SettingsRepositoryInterface $settings)
    {
        $this->settings = $settings;
    }

    public function __invoke(): array
    {
        return [
            'colorful-borders.enableBackgroundColor' => (bool)$this->settings->get('colorful-borders.enableBackgroundColor', false),
            'colorful-borders.backgroundColors' => $this->colors('backgroundColors'),
            'colorful-borders.enableBorderColor' => (bool)$this->settings->get('colorful-borders.enableBorderColor', true),
            'colorful-borders.borderColors' => $this->colors('borderColors'),
            'colorful-borders.enableTextColor' => (bool)$this->settings->get('colorful-borders.enableTextColor', false),
            'colorful-borders.textColors' => $this->colors('textColors'),
            'colorful-borders.enableBorderWidth' => (bool)$this->settings->get('colorful-borders.enableBorderWidth', true),
            'colorful-borders.borderWidthMin' => (int)$this->settings->get('colorful-borders.borderWidthMin') ?: 1,
            'colorful-borders.borderWidthMax' => (int)$this->settings->get('colorful-borders.borderWidthMax') ?: 10,
            'colorful-borders.enableBorderRadius' => (bool)$this->settings->get('colorful-borders.enableBorderRadius', true),
            'colorful-borders.borderRadiusMin' => (int)$this->settings->get('colorful-borders.borderRadiusMin') ?: 1,
            'colorful-borders.borderRadiusMax' => (int)$this->settings->get('colorful-borders.borderRadiusMax') ?: 10,
        ];
    }

    protected function colors(string $key)
    {
        $value = $this->settings->get('colorful-borders.' . $key, 'simple');

        if ($value === 'all') {
            return 'all';
        }

        if ($value === 'simple') {
            return DefaultPalettes::{$key}();
        }

        return explode(',', $value);
    }
}
