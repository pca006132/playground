type Catamorphism a b = (b, a -> b -> b)
listCata :: Catamorphism a b -> [a] -> b
listCata (nil, op) []     = 
    nil
listCata (nil, op) (a:as) = 
    op a $ listCata(nil, op) as

type Anamorphism a b = (b -> (a, b), b -> Bool)
listAna :: Anamorphism a b -> b -> [a]
listAna (g, p) b 
    | p(b) = [] 
    | otherwise = [x]++y where
        (a, b') = g b
        x = a
        y = listAna(g, p) b'

fact n = listCata(1, \x -> \y -> x*y) $ listAna(\x -> (x, x - 1), \x -> x == 0) n

multiply = listAna(\(a:as) -> (a * 3, as), \x -> x == [])
