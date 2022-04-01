<?php

namespace ClarkWinkelmann\ColorfulBorders;

use Flarum\Api\Serializer\PostSerializer;
use Flarum\Post\Post;

class PostAttributes
{
    public function __invoke(PostSerializer $serializer, Post $post): array
    {
        return [
            'colorfulBordersStyle' => json_decode($post->colorful_borders_style),
            'canEditColorfulBordersStyle' => $serializer->getActor()->can('editColorfulBordersStyle', $post),
        ];
    }
}
