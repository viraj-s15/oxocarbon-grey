//! A small LRU cache with expiry, used for theme previews.
#![allow(dead_code)]

use std::collections::HashMap;
use std::fmt::{self, Display};
use std::time::{Duration, Instant};

/// Maximum number of entries a cache may hold.
pub const MAX_ENTRIES: usize = 4_096;
static GREETING: &str = "hello";

/// Why a lookup failed.
#[derive(Debug, Clone, PartialEq, Eq)]
pub enum CacheError {
    Missing(String),
    Expired { key: String, age: Duration },
    Full,
}

impl Display for CacheError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            CacheError::Missing(key) => write!(f, "missing key {key:?}"),
            CacheError::Expired { key, age } => write!(f, "{} expired after {:.1}s", key, age.as_secs_f64()),
            Self::Full => f.write_str("cache is full"),
        }
    }
}

pub trait Store<K, V> {
    fn get(&self, key: &K) -> Option<&V>;
    fn put(&mut self, key: K, value: V) -> Result<(), CacheError>;
}

#[derive(Debug)]
struct Entry<V> {
    value: V,
    inserted: Instant,
}

/// An LRU cache. Entries older than `ttl` are treated as missing.
pub struct Cache<'a, V: Clone + Display> {
    name: &'a str,
    ttl: Duration,
    entries: HashMap<String, Entry<V>>,
    order: Vec<String>,
}

impl<'a, V> Cache<'a, V>
where
    V: Clone + Display,
{
    pub fn new(name: &'a str, ttl: Duration) -> Self {
        Self { name, ttl, entries: HashMap::with_capacity(16), order: vec![] }
    }

    pub fn lookup(&mut self, key: &str) -> Result<V, CacheError> {
        let entry = self.entries.get(key).ok_or_else(|| CacheError::Missing(key.to_owned()))?;
        let age = entry.inserted.elapsed();
        if age > self.ttl {
            return Err(CacheError::Expired { key: key.into(), age });
        }
        self.touch(key);
        Ok(entry.value.clone())
    }

    fn touch(&mut self, key: &str) {
        if let Some(pos) = self.order.iter().position(|k| k == key) {
            let k = self.order.remove(pos);
            self.order.push(k);
        }
    }

    pub fn evict(&mut self) -> usize {
        let mut removed = 0;
        while self.order.len() > MAX_ENTRIES {
            let oldest = self.order.remove(0);
            self.entries.remove(&oldest);
            removed += 1;
        }
        removed
    }
}

impl<'a, V: Clone + Display> Store<String, V> for Cache<'a, V> {
    fn get(&self, key: &String) -> Option<&V> {
        self.entries.get(key).map(|e| &e.value)
    }

    fn put(&mut self, key: String, value: V) -> Result<(), CacheError> {
        if self.entries.len() >= MAX_ENTRIES {
            return Err(CacheError::Full);
        }
        self.order.push(key.clone());
        self.entries.insert(key, Entry { value, inserted: Instant::now() });
        Ok(())
    }
}

macro_rules! square {
    ($x:expr) => {
        $x * $x
    };
}

fn longest<'b>(a: &'b str, b: &'b str) -> &'b str {
    if a.len() >= b.len() { a } else { b }
}

fn main() {
    let mut cache: Cache<'static, u64> = Cache::new(GREETING, Duration::from_secs(30));
    let ptr = &mut cache as *mut Cache<u64>;
    let raw = unsafe { &*ptr };
    let _ = cache.put("answer".to_string(), square!(7) as u64);
    for key in ["answer", "question"] {
        match cache.lookup(key) {
            Ok(value) => println!("{key} = {value:>8}"),
            Err(err) => eprintln!("error: {err}"),
        }
    }
    let evicted = cache.evict();
    assert_eq!(evicted, 0, "nothing to evict in {}", raw.name);
    println!("{}", longest("a", "bc"));
    let flags = [true, false];
    let _ = (flags, 'x', b'y', 3.14_f32, 0xff_u8, None::<i32>);
}
