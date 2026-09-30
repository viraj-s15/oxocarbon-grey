"""Inventory service: a small, realistic module for theme previews."""

from __future__ import annotations

import asyncio
import json
import logging
from collections import defaultdict
from dataclasses import dataclass, field
from enum import Enum
from pathlib import Path
from typing import Any, Callable, Iterator, Optional

log = logging.getLogger(__name__)

MAX_ITEMS = 1_000
DEFAULT_PATH = Path("~/.inventory.json").expanduser()
PATTERN = r"^[A-Z]{3}-\d{4}$"


class Status(Enum):
    ACTIVE = "active"
    ARCHIVED = "archived"


def cached(func: Callable[..., Any]) -> Callable[..., Any]:
    """Memoise a function on its positional arguments."""
    memo: dict[tuple, Any] = {}

    def wrapper(*args: Any, **kwargs: Any) -> Any:
        if args not in memo:
            memo[args] = func(*args, **kwargs)
        return memo[args]

    return wrapper


@dataclass(frozen=True, slots=True)
class Item:
    sku: str
    name: str
    price: float = 0.0
    tags: list[str] = field(default_factory=list)
    status: Status = Status.ACTIVE

    def __repr__(self) -> str:
        return f"Item({self.sku!r}, {self.name}, ${self.price:.2f})"

    @property
    def is_active(self) -> bool:
        return self.status is Status.ACTIVE


class Inventory:
    """A collection of items, grouped by tag.

    Items are stored by SKU; tags are indexed for quick lookup.
    """

    CURRENCY = "USD"

    def __init__(self, path: Optional[Path] = None) -> None:
        self.path = path or DEFAULT_PATH
        self._items: dict[str, Item] = {}
        self._by_tag: defaultdict[str, set[str]] = defaultdict(set)

    def __len__(self) -> int:
        return len(self._items)

    def __iter__(self) -> Iterator[Item]:
        yield from sorted(self._items.values(), key=lambda item: item.sku)

    @classmethod
    def from_json(cls, text: str) -> Inventory:
        inventory = cls()
        for raw in json.loads(text):
            inventory.add(Item(**raw))
        return inventory

    def add(self, item: Item) -> None:
        if len(self) >= MAX_ITEMS:
            raise OverflowError(f"inventory full ({MAX_ITEMS} items)")
        self._items[item.sku] = item
        for tag in item.tags:
            self._by_tag[tag].add(item.sku)

    def find(self, *, tag: str | None = None, limit: int = 10) -> list[Item]:
        # TODO: support multiple tags
        skus = self._by_tag.get(tag, set()) if tag else self._items.keys()
        return [self._items[s] for s in list(skus)[:limit] if s in self._items]

    def total(self) -> float:
        return round(sum(i.price for i in self if i.is_active), 2)

    def describe(self, item: Item) -> str:
        match item:
            case Item(status=Status.ARCHIVED):
                return "archived"
            case Item(price=p) if p > 100:
                return "premium"
            case _:
                return "standard"


async def sync(inventory: Inventory, *, retries: int = 3) -> bool:
    for attempt in range(retries):
        try:
            await asyncio.sleep(0.1 * attempt)
            if (count := len(inventory)) == 0:
                return False
            log.info("synced %d items", count)
            return True
        except (ConnectionError, TimeoutError) as exc:
            log.warning("attempt %d failed: %s", attempt, exc)
        finally:
            print("done", end="\n", flush=True)
    return False


if __name__ == "__main__":
    inv = Inventory.from_json('[{"sku": "ABC-0001", "name": "Widget", "price": 9.5}]')
    print(inv.total(), inv.find(tag="tools", limit=5), None, True)
    asyncio.run(sync(inv, retries=2))
