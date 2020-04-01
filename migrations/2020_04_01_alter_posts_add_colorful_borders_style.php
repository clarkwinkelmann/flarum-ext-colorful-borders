<?php

use Flarum\Database\Migration;

return Migration::addColumns('posts', [
    'colorful_borders_style' => ['json', 'nullable' => true],
]);
