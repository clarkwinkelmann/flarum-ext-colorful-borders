<?php

namespace ClarkWinkelmann\ColorfulBorders\Extenders;

use ClarkWinkelmann\ColorfulBorders\DefaultPalettes;
use Flarum\Post\Event\Saving;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Flarum\Settings\SettingsRepositoryInterface;
use Flarum\User\AssertPermissionTrait;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Validation\Factory;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;

class SavePostStyle implements ExtenderInterface
{
    use AssertPermissionTrait;

    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(Saving::class, [$this, 'saving']);
    }

    public function saving(Saving $event)
    {
        $style = Arr::get($event->data, 'attributes.colorfulBordersStyle', false);

        if ($style !== false) {
            $this->assertCan($event->actor, 'editColorfulBordersStyle', $event->post);

            if (is_array($style)) {
                $rules = $this->validationRules();

                // Only keep allowed styles
                $style = Arr::only($style, array_keys($rules));

                /**
                 * @var $factory Factory
                 */
                $factory = app(Factory::class);

                $validator = $factory->make($style, $rules);

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
        /**
         * @var $settings SettingsRepositoryInterface
         */
        $settings = app(SettingsRepositoryInterface::class);

        $rules = [];

        if ($settings->get('colorful-borders.enableBackgroundColor', false)) {
            $rules['backgroundColor'] = $this->validationRuleForColor($settings, 'backgroundColors');
        }

        if ($settings->get('colorful-borders.enableBorderColor', false)) {
            $rules['borderColor'] = $this->validationRuleForColor($settings, 'borderColors');
        }

        if ($settings->get('colorful-borders.enableTextColor', false)) {
            $rules['color'] = $this->validationRuleForColor($settings, 'textColors');
        }

        if ($settings->get('colorful-borders.enableBorderWidth', false)) {
            $in = [];

            for ($i = ($settings->get('colorful-borders.borderWidthMin') ?: 1); $i <= ($settings->get('colorful-borders.borderWidthMax') ?: 10); $i++) {
                $in[] = $i . 'px';
            }

            $rules['borderWidth'] = [
                'sometimes',
                Rule::in($in),
            ];
        }

        if ($settings->get('colorful-borders.enableBorderRadius', false)) {
            $in = [];

            for ($i = ($settings->get('colorful-borders.borderRadiusMin') ?: 0); $i <= ($settings->get('colorful-borders.borderRadiusMax') ?: 10); $i++) {
                $in[] = $i . 'px';
            }

            $rules['borderRadius'] = [
                'sometimes',
                Rule::in($in),
            ];
        }

        return $rules;
    }

    protected function validationRuleForColor(SettingsRepositoryInterface $settings, $key)
    {
        $colors = $settings->get('colorful-borders.' . $key, 'simple');

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
