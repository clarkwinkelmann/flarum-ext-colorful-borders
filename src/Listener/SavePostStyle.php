<?php

namespace ClarkWinkelmann\ColorfulBorders\Listener;

use ClarkWinkelmann\ColorfulBorders\DefaultPalettes;
use Flarum\Post\Event\Saving;
use Flarum\Settings\SettingsRepositoryInterface;
use Illuminate\Contracts\Validation\Factory;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;

class SavePostStyle
{
    protected $settings;
    protected $validation;

    public function __construct(SettingsRepositoryInterface $settings, Factory $validation)
    {
        $this->settings = $settings;
        $this->validation = $validation;
    }

    public function handle(Saving $event)
    {
        $style = Arr::get($event->data, 'attributes.colorfulBordersStyle', false);

        if ($style !== false) {
            $event->actor->assertCan('editColorfulBordersStyle', $event->post);

            if (is_array($style)) {
                $rules = $this->validationRules();

                // Only keep allowed styles
                $style = Arr::only($style, array_keys($rules));

                $validator = $this->validation->make($style, $rules);

                $validator->validate();

                if (count($style) === 0) {
                    $style = null;
                } else {
                    $style = json_encode($style);
                }
            } else {
                $style = null;
            }

            $event->post->colorful_borders_style = $style;
        }
    }

    protected function validationRules(): array
    {
        $rules = [];

        if ($this->settings->get('colorful-borders.enableBackgroundColor', false)) {
            $rules['backgroundColor'] = $this->validationRuleForColor('backgroundColors');
        }

        if ($this->settings->get('colorful-borders.enableBorderColor', true)) {
            $rules['borderColor'] = $this->validationRuleForColor('borderColors');
        }

        if ($this->settings->get('colorful-borders.enableTextColor', false)) {
            $rules['color'] = $this->validationRuleForColor('textColors');
        }

        if ($this->settings->get('colorful-borders.enableBorderWidth', true)) {
            $in = [];

            for ($i = ($this->settings->get('colorful-borders.borderWidthMin') ?: 1); $i <= ($this->settings->get('colorful-borders.borderWidthMax') ?: 10); $i++) {
                $in[] = $i . 'px';
            }

            $rules['borderWidth'] = [
                'sometimes',
                Rule::in($in),
            ];
        }

        if ($this->settings->get('colorful-borders.enableBorderRadius', true)) {
            $in = [];

            for ($i = ($this->settings->get('colorful-borders.borderRadiusMin') ?: 0); $i <= ($this->settings->get('colorful-borders.borderRadiusMax') ?: 10); $i++) {
                $in[] = $i . 'px';
            }

            $rules['borderRadius'] = [
                'sometimes',
                Rule::in($in),
            ];
        }

        return $rules;
    }

    protected function validationRuleForColor(string $key): array
    {
        $colors = $this->settings->get('colorful-borders.' . $key, 'simple');

        $validation = 'regex:~^#[0-9a-f]{6}$~i';

        if ($colors === 'all') {
            // Do nothing, use default validation rule defined above
        } else if ($colors === 'simple') {
            $validation = Rule::in(DefaultPalettes::{$key}());
        } else {
            $validation = Rule::in(explode(',', $colors));
        }

        return [
            'sometimes',
            $validation,
        ];
    }
}
