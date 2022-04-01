<?php

namespace ClarkWinkelmann\ColorfulBorders\Access;

use Flarum\Post\Post;
use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;

class PostPolicy extends AbstractPolicy
{
    public function editColorfulBordersStyle(User $actor, Post $post)
    {
        return $this->editOwn($actor, $post) || $this->editAny($actor);
    }

    protected function editOwn(User $actor, Post $post)
    {
        return $actor->id === $post->user_id && $actor->can('colorful-borders.editOwnPost');
    }

    protected function editAny(User $actor)
    {
        return $actor->can('colorful-borders.editAnyPost');
    }
}
