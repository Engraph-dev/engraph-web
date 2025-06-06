PARENT_BRANCH=$(git branch --show-current)

cd prisma
if git show-ref --verify --quiet refs/heads/"$PARENT_BRANCH"; then
  git checkout "$PARENT_BRANCH"
else
  git checkout -b "$PARENT_BRANCH"
fi

git pull origin $PARENT_BRANCH
git push origin $PARENT_BRANCH
cd ..

cd src/lib/defs
if git show-ref --verify --quiet refs/heads/"$PARENT_BRANCH"; then
  git checkout "$PARENT_BRANCH"
else
  git checkout -b "$PARENT_BRANCH"
fi
git pull origin $PARENT_BRANCH
git push origin $PARENT_BRANCH
cd ../../../
