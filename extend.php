<?php

namespace ClarkWinkelmann\ColorfulBorders;

use Flarum\Extend;
use Illuminate\Contracts\Events\Dispatcher;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')
        ->css(__DIR__ . '/resources/less/admin.less'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    new Extenders\ForumAttributes(),
    new Extenders\PostAttributes(),
    new Extenders\SavePostStyle(),

    function (Dispatcher $dispatcher) {
        $dispatcher->subscribe(Access\PostPolicy::class);
    },
];
