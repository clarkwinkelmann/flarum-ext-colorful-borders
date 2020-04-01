<?php

namespace ClarkWinkelmann\ColorfulBorders\Extenders;

use Flarum\Api\Event\Serializing;
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Extend\ExtenderInterface;
use Flarum\Extension\Extension;
use Illuminate\Contracts\Container\Container;

class PostAttributes implements ExtenderInterface
{
    public function extend(Container $container, Extension $extension = null)
    {
        $container['events']->listen(Serializing::class, [$this, 'attributes']);
    }

    public function attributes(Serializing $event)
    {
        if ($event->isSerializer(PostSerializer::class)) {
            $event->attributes += [
                'colorfulBordersStyle' => json_decode($event->model->colorful_borders_style),
                'canEditColorfulBordersStyle' => $event->actor->can('editColorfulBordersStyle', $event->model),
            ];
        }
    }
}
