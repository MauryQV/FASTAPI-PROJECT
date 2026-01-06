import statistics

def factorial(n: int ) -> int:
    if n == 0 or n == 1:
        return 1
    else:
        return n*factorial(n-1)
    
def stats (data: list):
    return {
        "mean": statistics.mean(data),
        "median": statistics.median(data),
        "stdev": statistics.stdev(data) if len(data) > 1 else 0
    }