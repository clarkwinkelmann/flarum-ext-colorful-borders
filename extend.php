<?php

namespace ClarkWinkelmann\ColorfulBorders;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Api\Serializer\PostSerializer;
use Flarum\Extend;
use Flarum\Post\Event\Saving;
use Flarum\Post\Post;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/resources/less/admin.less'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attributes(ForumAttributes::class),

    (new Extend\ApiSerializer(PostSerializer::class))
        ->attributes(PostAttributes::class),

    (new Extend\Event())
        ->listen(Saving::class, Listener\SavePostStyle::class),

    (new Extend\Policy())
        ->modelPolicy(Post::class, Access\PostPolicy::class),
];
