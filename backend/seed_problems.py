"""
Seed script — creates 10 problems with full metadata via the API.
Run AFTER the backend is up: python seed_problems.py
"""
import json
import requests

BASE = "http://localhost:8000/api/v1"

PROBLEMS = [
    # -----------------------------------------------------------------------
    # 1. Two Sum
    # -----------------------------------------------------------------------
    {
        "slug": "two-sum",
        "title": "Two Sum",
        "difficulty": "easy",
        "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
        "examples_json": json.dumps([
            {"input": "nums = [2,7,11,15], target = 9", "output": "[0, 1]", "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."},
            {"input": "nums = [3,2,4], target = 6", "output": "[1, 2]"},
        ]),
        "constraints_json": json.dumps([
            "2 ≤ nums.length ≤ 10⁴",
            "-10⁹ ≤ nums[i] ≤ 10⁹",
            "-10⁹ ≤ target ≤ 10⁹",
            "Only one valid answer exists.",
        ]),
        "code_templates_json": json.dumps({
            "python": "import json\n\ndef twoSum(nums, target):\n    # Write your solution here\n    pass\n\nnums = json.loads(input())\ntarget = int(input())\nprint(json.dumps(twoSum(nums, target)))\n",
            "cpp": '#include <iostream>\n#include <vector>\n#include <string>\n#include <sstream>\nusing namespace std;\n\nvector<int> twoSum(vector<int>& nums, int target) {\n    // Write your solution here\n    return {};\n}\n\nint main() {\n    string line;\n    getline(cin, line);\n    vector<int> nums;\n    int x; char c;\n    stringstream ss(line);\n    while (ss >> c) { if (c==\'-\'||(c>=\'0\'&&c<=\'9\')){ss.putback(c);ss>>x;nums.push_back(x);} }\n    int target; cin >> target;\n    auto r = twoSum(nums, target);\n    cout << "[" << r[0] << ", " << r[1] << "]" << endl;\n}\n',
            "java": 'import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine().replaceAll("[\\\\[\\\\]]", "");\n        String[] parts = line.split(",");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++)\n            nums[i] = Integer.parseInt(parts[i].trim());\n        int target = Integer.parseInt(sc.nextLine().trim());\n        int[] res = new Solution().twoSum(nums, target);\n        System.out.println("[" + res[0] + ", " + res[1] + "]");\n    }\n}\n',
            "c": '#include <stdio.h>\n#include <stdlib.h>\n#include <string.h>\n\nvoid twoSum(int* nums, int n, int target, int* res) {\n    // Write your solution here\n}\n\nint main() {\n    char line[4096]; fgets(line, sizeof(line), stdin);\n    int nums[10000], n=0; char *p=line;\n    while(*p){if(*p==\'-\'||(*p>=\'0\'&&*p<=\'9\')){nums[n++]=atoi(p);while(*p==\'-\'||(*p>=\'0\'&&*p<=\'9\'))p++;}else p++;}\n    int target; scanf("%d",&target);\n    int res[2]={-1,-1}; twoSum(nums,n,target,res);\n    printf("[%d, %d]\\n",res[0],res[1]);\n}\n',
        }),
        "testcases": [
            {"ordinal": 0, "input_text": "[2,7,11,15]\n9", "output_text": "[0, 1]", "is_hidden": False},
            {"ordinal": 1, "input_text": "[3,2,4]\n6", "output_text": "[1, 2]", "is_hidden": False},
            {"ordinal": 2, "input_text": "[3,3]\n6", "output_text": "[0, 1]", "is_hidden": True},
        ],
    },
    # -----------------------------------------------------------------------
    # 2. Palindrome Number
    # -----------------------------------------------------------------------
    {
        "slug": "palindrome-number",
        "title": "Palindrome Number",
        "difficulty": "easy",
        "description": "Given an integer `x`, return `true` if `x` is a palindrome, and `false` otherwise.\n\nAn integer is a palindrome when it reads the same forward and backward.",
        "examples_json": json.dumps([
            {"input": "x = 121", "output": "true", "explanation": "121 reads as 121 from left to right and from right to left."},
            {"input": "x = -121", "output": "false", "explanation": "From left to right, it reads -121. From right to left it becomes 121-. Therefore it is not a palindrome."},
        ]),
        "constraints_json": json.dumps(["-2³¹ ≤ x ≤ 2³¹ - 1"]),
        "code_templates_json": json.dumps({
            "python": "def isPalindrome(x):\n    # Write your solution here\n    pass\n\nx = int(input())\nprint(str(isPalindrome(x)).lower())\n",
            "cpp": '#include <iostream>\n#include <string>\nusing namespace std;\n\nbool isPalindrome(int x) {\n    // Write your solution here\n    return false;\n}\n\nint main() {\n    int x; cin >> x;\n    cout << (isPalindrome(x) ? "true" : "false") << endl;\n}\n',
            "java": 'import java.util.*;\n\nclass Solution {\n    public boolean isPalindrome(int x) {\n        // Write your solution here\n        return false;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int x = sc.nextInt();\n        System.out.println(new Solution().isPalindrome(x));\n    }\n}\n',
            "c": '#include <stdio.h>\n#include <stdbool.h>\n\nbool isPalindrome(int x) {\n    // Write your solution here\n    return false;\n}\n\nint main() {\n    int x; scanf("%d", &x);\n    printf("%s\\n", isPalindrome(x) ? "true" : "false");\n}\n',
        }),
        "testcases": [
            {"ordinal": 0, "input_text": "121", "output_text": "true", "is_hidden": False},
            {"ordinal": 1, "input_text": "-121", "output_text": "false", "is_hidden": False},
            {"ordinal": 2, "input_text": "10", "output_text": "false", "is_hidden": True},
        ],
    },
    # -----------------------------------------------------------------------
    # 3. Reverse Integer
    # -----------------------------------------------------------------------
    {
        "slug": "reverse-integer",
        "title": "Reverse Integer",
        "difficulty": "medium",
        "description": "Given a signed 32-bit integer `x`, return `x` with its digits reversed. If reversing `x` causes the value to go outside the signed 32-bit integer range [-2³¹, 2³¹ - 1], then return 0.",
        "examples_json": json.dumps([
            {"input": "x = 123", "output": "321"},
            {"input": "x = -123", "output": "-321"},
            {"input": "x = 120", "output": "21"},
        ]),
        "constraints_json": json.dumps(["-2³¹ ≤ x ≤ 2³¹ - 1"]),
        "code_templates_json": json.dumps({
            "python": "def reverse(x):\n    # Write your solution here\n    pass\n\nx = int(input())\nprint(reverse(x))\n",
            "cpp": '#include <iostream>\nusing namespace std;\n\nint reverse(int x) {\n    // Write your solution here\n    return 0;\n}\n\nint main() {\n    int x; cin >> x;\n    cout << reverse(x) << endl;\n}\n',
            "java": 'import java.util.*;\n\nclass Solution {\n    public int reverse(int x) {\n        // Write your solution here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int x = sc.nextInt();\n        System.out.println(new Solution().reverse(x));\n    }\n}\n',
            "c": '#include <stdio.h>\n\nint reverse(int x) {\n    // Write your solution here\n    return 0;\n}\n\nint main() {\n    int x; scanf("%d", &x);\n    printf("%d\\n", reverse(x));\n}\n',
        }),
        "testcases": [
            {"ordinal": 0, "input_text": "123", "output_text": "321", "is_hidden": False},
            {"ordinal": 1, "input_text": "-123", "output_text": "-321", "is_hidden": False},
            {"ordinal": 2, "input_text": "1534236469", "output_text": "0", "is_hidden": True},
        ],
    },
    # -----------------------------------------------------------------------
    # 4. Roman to Integer
    # -----------------------------------------------------------------------
    {
        "slug": "roman-to-integer",
        "title": "Roman to Integer",
        "difficulty": "easy",
        "description": "Given a roman numeral, convert it to an integer.\n\nRoman numerals are represented by seven symbols: I(1), V(5), X(10), L(50), C(100), D(500), M(1000).\n\nFor example, 2 is written as II, 12 is written as XII, 27 is written as XXVII.",
        "examples_json": json.dumps([
            {"input": 's = "III"', "output": "3"},
            {"input": 's = "LVIII"', "output": "58", "explanation": "L = 50, V = 5, III = 3."},
            {"input": 's = "MCMXCIV"', "output": "1994", "explanation": "M = 1000, CM = 900, XC = 90 and IV = 4."},
        ]),
        "constraints_json": json.dumps(["1 ≤ s.length ≤ 15", "s contains only characters I, V, X, L, C, D, M"]),
        "code_templates_json": json.dumps({
            "python": "def romanToInt(s):\n    # Write your solution here\n    pass\n\ns = input().strip()\nprint(romanToInt(s))\n",
            "cpp": '#include <iostream>\n#include <string>\nusing namespace std;\n\nint romanToInt(string s) {\n    // Write your solution here\n    return 0;\n}\n\nint main() {\n    string s; getline(cin, s);\n    cout << romanToInt(s) << endl;\n}\n',
            "java": 'import java.util.*;\n\nclass Solution {\n    public int romanToInt(String s) {\n        // Write your solution here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().trim();\n        System.out.println(new Solution().romanToInt(s));\n    }\n}\n',
            "c": '#include <stdio.h>\n#include <string.h>\n\nint romanToInt(char* s) {\n    // Write your solution here\n    return 0;\n}\n\nint main() {\n    char s[20]; scanf("%s", s);\n    printf("%d\\n", romanToInt(s));\n}\n',
        }),
        "testcases": [
            {"ordinal": 0, "input_text": "III", "output_text": "3", "is_hidden": False},
            {"ordinal": 1, "input_text": "LVIII", "output_text": "58", "is_hidden": False},
            {"ordinal": 2, "input_text": "MCMXCIV", "output_text": "1994", "is_hidden": True},
        ],
    },
    # -----------------------------------------------------------------------
    # 5. Valid Parentheses
    # -----------------------------------------------------------------------
    {
        "slug": "valid-parentheses",
        "title": "Valid Parentheses",
        "difficulty": "easy",
        "description": "Given a string `s` containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
        "examples_json": json.dumps([
            {"input": 's = "()"', "output": "true"},
            {"input": 's = "()[]{}"', "output": "true"},
            {"input": 's = "(]"', "output": "false"},
        ]),
        "constraints_json": json.dumps(["1 ≤ s.length ≤ 10⁴", "s consists of parentheses only '()[]{}'."]),
        "code_templates_json": json.dumps({
            "python": "def isValid(s):\n    # Write your solution here\n    pass\n\ns = input().strip()\nprint(str(isValid(s)).lower())\n",
            "cpp": '#include <iostream>\n#include <string>\n#include <stack>\nusing namespace std;\n\nbool isValid(string s) {\n    // Write your solution here\n    return false;\n}\n\nint main() {\n    string s; getline(cin, s);\n    cout << (isValid(s) ? "true" : "false") << endl;\n}\n',
            "java": 'import java.util.*;\n\nclass Solution {\n    public boolean isValid(String s) {\n        // Write your solution here\n        return false;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String s = sc.nextLine().trim();\n        System.out.println(new Solution().isValid(s));\n    }\n}\n',
            "c": '#include <stdio.h>\n#include <stdbool.h>\n#include <string.h>\n\nbool isValid(char* s) {\n    // Write your solution here\n    return false;\n}\n\nint main() {\n    char s[10001]; scanf("%s", s);\n    printf("%s\\n", isValid(s) ? "true" : "false");\n}\n',
        }),
        "testcases": [
            {"ordinal": 0, "input_text": "()", "output_text": "true", "is_hidden": False},
            {"ordinal": 1, "input_text": "()[]{}", "output_text": "true", "is_hidden": False},
            {"ordinal": 2, "input_text": "(]", "output_text": "false", "is_hidden": True},
        ],
    },
    # -----------------------------------------------------------------------
    # 6. FizzBuzz
    # -----------------------------------------------------------------------
    {
        "slug": "fizzbuzz",
        "title": "FizzBuzz",
        "difficulty": "easy",
        "description": "Given an integer `n`, return a string array `answer` (1-indexed) where:\n- `answer[i] == \"FizzBuzz\"` if `i` is divisible by 3 and 5.\n- `answer[i] == \"Fizz\"` if `i` is divisible by 3.\n- `answer[i] == \"Buzz\"` if `i` is divisible by 5.\n- `answer[i] == i` (as a string) if none of the above conditions are true.",
        "examples_json": json.dumps([
            {"input": "n = 3", "output": '["1","2","Fizz"]'},
            {"input": "n = 5", "output": '["1","2","Fizz","4","Buzz"]'},
            {"input": "n = 15", "output": '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]'},
        ]),
        "constraints_json": json.dumps(["1 ≤ n ≤ 10⁴"]),
        "code_templates_json": json.dumps({
            "python": 'import json\n\ndef fizzBuzz(n):\n    # Write your solution here\n    return []\n\nn = int(input())\nprint(json.dumps(fizzBuzz(n)))\n',
            "cpp": '#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\nvector<string> fizzBuzz(int n) {\n    // Write your solution here\n    return {};\n}\n\nint main() {\n    int n; cin >> n;\n    auto r = fizzBuzz(n);\n    cout << "[";\n    for (int i = 0; i < r.size(); i++) {\n        cout << "\\"" << r[i] << "\\"";\n        if (i < r.size()-1) cout << ",";\n    }\n    cout << "]" << endl;\n}\n',
            "java": 'import java.util.*;\n\nclass Solution {\n    public List<String> fizzBuzz(int n) {\n        // Write your solution here\n        return new ArrayList<>();\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        List<String> res = new Solution().fizzBuzz(n);\n        StringBuilder sb = new StringBuilder("[");\n        for (int i = 0; i < res.size(); i++) {\n            sb.append("\\"").append(res.get(i)).append("\\"");\n            if (i < res.size()-1) sb.append(",");\n        }\n        sb.append("]");\n        System.out.println(sb);\n    }\n}\n',
            "c": '#include <stdio.h>\n\nint main() {\n    int n; scanf("%d", &n);\n    printf("[");\n    for (int i = 1; i <= n; i++) {\n        if (i%15==0) printf("\\"FizzBuzz\\"");\n        else if (i%3==0) printf("\\"Fizz\\"");\n        else if (i%5==0) printf("\\"Buzz\\"");\n        else printf("\\"%d\\"", i);\n        if (i < n) printf(",");\n    }\n    printf("]\\n");\n}\n',
        }),
        "testcases": [
            {"ordinal": 0, "input_text": "3", "output_text": '["1","2","Fizz"]', "is_hidden": False},
            {"ordinal": 1, "input_text": "5", "output_text": '["1","2","Fizz","4","Buzz"]', "is_hidden": False},
            {"ordinal": 2, "input_text": "15", "output_text": '["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"]', "is_hidden": True},
        ],
    },
    # -----------------------------------------------------------------------
    # 7. Fibonacci Number
    # -----------------------------------------------------------------------
    {
        "slug": "fibonacci-number",
        "title": "Fibonacci Number",
        "difficulty": "easy",
        "description": "The Fibonacci numbers form a sequence such that each number is the sum of the two preceding ones, starting from 0 and 1. That is, F(0) = 0, F(1) = 1, F(n) = F(n - 1) + F(n - 2), for n > 1.\n\nGiven `n`, calculate `F(n)`.",
        "examples_json": json.dumps([
            {"input": "n = 2", "output": "1", "explanation": "F(2) = F(1) + F(0) = 1 + 0 = 1."},
            {"input": "n = 3", "output": "2", "explanation": "F(3) = F(2) + F(1) = 1 + 1 = 2."},
            {"input": "n = 4", "output": "3", "explanation": "F(4) = F(3) + F(2) = 2 + 1 = 3."},
        ]),
        "constraints_json": json.dumps(["0 ≤ n ≤ 30"]),
        "code_templates_json": json.dumps({
            "python": "def fib(n):\n    # Write your solution here\n    pass\n\nn = int(input())\nprint(fib(n))\n",
            "cpp": '#include <iostream>\nusing namespace std;\n\nint fib(int n) {\n    // Write your solution here\n    return 0;\n}\n\nint main() {\n    int n; cin >> n;\n    cout << fib(n) << endl;\n}\n',
            "java": 'import java.util.*;\n\nclass Solution {\n    public int fib(int n) {\n        // Write your solution here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = sc.nextInt();\n        System.out.println(new Solution().fib(n));\n    }\n}\n',
            "c": '#include <stdio.h>\n\nint fib(int n) {\n    // Write your solution here\n    return 0;\n}\n\nint main() {\n    int n; scanf("%d", &n);\n    printf("%d\\n", fib(n));\n}\n',
        }),
        "testcases": [
            {"ordinal": 0, "input_text": "2", "output_text": "1", "is_hidden": False},
            {"ordinal": 1, "input_text": "3", "output_text": "2", "is_hidden": False},
            {"ordinal": 2, "input_text": "10", "output_text": "55", "is_hidden": True},
        ],
    },
    # -----------------------------------------------------------------------
    # 8. Maximum Subarray
    # -----------------------------------------------------------------------
    {
        "slug": "maximum-subarray",
        "title": "Maximum Subarray",
        "difficulty": "medium",
        "description": "Given an integer array `nums`, find the subarray with the largest sum, and return its sum.",
        "examples_json": json.dumps([
            {"input": "nums = [-2,1,-3,4,-1,2,1,-5,4]", "output": "6", "explanation": "The subarray [4,-1,2,1] has the largest sum 6."},
            {"input": "nums = [1]", "output": "1"},
            {"input": "nums = [5,4,-1,7,8]", "output": "23"},
        ]),
        "constraints_json": json.dumps(["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"]),
        "code_templates_json": json.dumps({
            "python": "import json\n\ndef maxSubArray(nums):\n    # Write your solution here\n    pass\n\nnums = json.loads(input())\nprint(maxSubArray(nums))\n",
            "cpp": '#include <iostream>\n#include <vector>\n#include <sstream>\n#include <climits>\nusing namespace std;\n\nint maxSubArray(vector<int>& nums) {\n    // Write your solution here\n    return 0;\n}\n\nint main() {\n    string line; getline(cin, line);\n    vector<int> nums; int x; char c;\n    stringstream ss(line);\n    while(ss>>c){if(c==\'-\'||(c>=\'0\'&&c<=\'9\')){ss.putback(c);ss>>x;nums.push_back(x);}}\n    cout << maxSubArray(nums) << endl;\n}\n',
            "java": 'import java.util.*;\n\nclass Solution {\n    public int maxSubArray(int[] nums) {\n        // Write your solution here\n        return 0;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine().replaceAll("[\\\\[\\\\]]", "");\n        String[] parts = line.split(",");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++)\n            nums[i] = Integer.parseInt(parts[i].trim());\n        System.out.println(new Solution().maxSubArray(nums));\n    }\n}\n',
            "c": '#include <stdio.h>\n#include <stdlib.h>\n#include <limits.h>\n\nint maxSubArray(int* nums, int n) {\n    // Write your solution here\n    return 0;\n}\n\nint main() {\n    char line[500000]; fgets(line, sizeof(line), stdin);\n    int nums[100000], n=0; char *p=line;\n    while(*p){if(*p==\'-\'||(*p>=\'0\'&&*p<=\'9\')){nums[n++]=atoi(p);while(*p==\'-\'||(*p>=\'0\'&&*p<=\'9\'))p++;}else p++;}\n    printf("%d\\n", maxSubArray(nums, n));\n}\n',
        }),
        "testcases": [
            {"ordinal": 0, "input_text": "[-2,1,-3,4,-1,2,1,-5,4]", "output_text": "6", "is_hidden": False},
            {"ordinal": 1, "input_text": "[1]", "output_text": "1", "is_hidden": False},
            {"ordinal": 2, "input_text": "[5,4,-1,7,8]", "output_text": "23", "is_hidden": True},
        ],
    },
    # -----------------------------------------------------------------------
    # 9. Contains Duplicate
    # -----------------------------------------------------------------------
    {
        "slug": "contains-duplicate",
        "title": "Contains Duplicate",
        "difficulty": "easy",
        "description": "Given an integer array `nums`, return `true` if any value appears at least twice in the array, and return `false` if every element is distinct.",
        "examples_json": json.dumps([
            {"input": "nums = [1,2,3,1]", "output": "true"},
            {"input": "nums = [1,2,3,4]", "output": "false"},
            {"input": "nums = [1,1,1,3,3,4,3,2,4,2]", "output": "true"},
        ]),
        "constraints_json": json.dumps(["1 ≤ nums.length ≤ 10⁵", "-10⁹ ≤ nums[i] ≤ 10⁹"]),
        "code_templates_json": json.dumps({
            "python": "import json\n\ndef containsDuplicate(nums):\n    # Write your solution here\n    pass\n\nnums = json.loads(input())\nprint(str(containsDuplicate(nums)).lower())\n",
            "cpp": '#include <iostream>\n#include <vector>\n#include <sstream>\n#include <unordered_set>\nusing namespace std;\n\nbool containsDuplicate(vector<int>& nums) {\n    // Write your solution here\n    return false;\n}\n\nint main() {\n    string line; getline(cin, line);\n    vector<int> nums; int x; char c;\n    stringstream ss(line);\n    while(ss>>c){if(c==\'-\'||(c>=\'0\'&&c<=\'9\')){ss.putback(c);ss>>x;nums.push_back(x);}}\n    cout << (containsDuplicate(nums) ? "true" : "false") << endl;\n}\n',
            "java": 'import java.util.*;\n\nclass Solution {\n    public boolean containsDuplicate(int[] nums) {\n        // Write your solution here\n        return false;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine().replaceAll("[\\\\[\\\\]]", "");\n        String[] parts = line.split(",");\n        int[] nums = new int[parts.length];\n        for (int i = 0; i < parts.length; i++)\n            nums[i] = Integer.parseInt(parts[i].trim());\n        System.out.println(new Solution().containsDuplicate(nums));\n    }\n}\n',
            "c": '#include <stdio.h>\n#include <stdlib.h>\n#include <stdbool.h>\n\nbool containsDuplicate(int* nums, int n) {\n    // Write your solution here\n    return false;\n}\n\nint main() {\n    char line[500000]; fgets(line, sizeof(line), stdin);\n    int nums[100000], n=0; char *p=line;\n    while(*p){if(*p==\'-\'||(*p>=\'0\'&&*p<=\'9\')){nums[n++]=atoi(p);while(*p==\'-\'||(*p>=\'0\'&&*p<=\'9\'))p++;}else p++;}\n    printf("%s\\n", containsDuplicate(nums, n) ? "true" : "false");\n}\n',
        }),
        "testcases": [
            {"ordinal": 0, "input_text": "[1,2,3,1]", "output_text": "true", "is_hidden": False},
            {"ordinal": 1, "input_text": "[1,2,3,4]", "output_text": "false", "is_hidden": False},
            {"ordinal": 2, "input_text": "[1,1,1,3,3,4,3,2,4,2]", "output_text": "true", "is_hidden": True},
        ],
    },
    # -----------------------------------------------------------------------
    # 10. Plus One
    # -----------------------------------------------------------------------
    {
        "slug": "plus-one",
        "title": "Plus One",
        "difficulty": "easy",
        "description": "You are given a large integer represented as an integer array `digits`, where each `digits[i]` is the iᵗʰ digit of the integer. The digits are ordered from most significant to least significant in left-to-right order. The large integer does not contain any leading 0's.\n\nIncrement the large integer by one and return the resulting array of digits.",
        "examples_json": json.dumps([
            {"input": "digits = [1,2,3]", "output": "[1, 2, 4]", "explanation": "The array represents the integer 123. Incrementing by one gives 124."},
            {"input": "digits = [9,9,9]", "output": "[1, 0, 0, 0]"},
        ]),
        "constraints_json": json.dumps(["1 ≤ digits.length ≤ 100", "0 ≤ digits[i] ≤ 9"]),
        "code_templates_json": json.dumps({
            "python": "import json\n\ndef plusOne(digits):\n    # Write your solution here\n    return []\n\ndigits = json.loads(input())\nprint(json.dumps(plusOne(digits)))\n",
            "cpp": '#include <iostream>\n#include <vector>\n#include <sstream>\nusing namespace std;\n\nvector<int> plusOne(vector<int>& digits) {\n    // Write your solution here\n    return {};\n}\n\nint main() {\n    string line; getline(cin, line);\n    vector<int> digits; int x; char c;\n    stringstream ss(line);\n    while(ss>>c){if(c>=\'0\'&&c<=\'9\'){ss.putback(c);ss>>x;digits.push_back(x);}}\n    auto r = plusOne(digits);\n    cout << "[";\n    for(int i=0;i<r.size();i++){cout<<r[i];if(i<r.size()-1)cout<<", ";}\n    cout << "]" << endl;\n}\n',
            "java": 'import java.util.*;\n\nclass Solution {\n    public int[] plusOne(int[] digits) {\n        // Write your solution here\n        return new int[]{};\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        String line = sc.nextLine().replaceAll("[\\\\[\\\\]]", "");\n        String[] parts = line.split(",");\n        int[] digits = new int[parts.length];\n        for (int i = 0; i < parts.length; i++)\n            digits[i] = Integer.parseInt(parts[i].trim());\n        int[] res = new Solution().plusOne(digits);\n        StringBuilder sb = new StringBuilder("[");\n        for (int i = 0; i < res.length; i++) {\n            sb.append(res[i]);\n            if (i < res.length-1) sb.append(", ");\n        }\n        sb.append("]");\n        System.out.println(sb);\n    }\n}\n',
            "c": '#include <stdio.h>\n#include <stdlib.h>\n\nint* plusOne(int* digits, int n, int* retSize) {\n    // Write your solution here\n    *retSize = 0;\n    return NULL;\n}\n\nint main() {\n    char line[1024]; fgets(line, sizeof(line), stdin);\n    int digits[101], n=0; char *p=line;\n    while(*p){if(*p>=\'0\'&&*p<=\'9\'){digits[n++]=*p-\'0\';}p++;}\n    int retSize;\n    int* res = plusOne(digits, n, &retSize);\n    printf("[");\n    for(int i=0;i<retSize;i++){printf("%d",res[i]);if(i<retSize-1)printf(", ");}\n    printf("]\\n");\n    free(res);\n}\n',
        }),
        "testcases": [
            {"ordinal": 0, "input_text": "[1,2,3]", "output_text": "[1, 2, 4]", "is_hidden": False},
            {"ordinal": 1, "input_text": "[9,9,9]", "output_text": "[1, 0, 0, 0]", "is_hidden": False},
            {"ordinal": 2, "input_text": "[0]", "output_text": "[1]", "is_hidden": True},
        ],
    },
]


def seed():
    # First delete existing problems (optional — skip duplicates)
    for prob in PROBLEMS:
        try:
            resp = requests.post(f"{BASE}/problems", json=prob, timeout=10)
            if resp.status_code == 201:
                data = resp.json()
                print(f"  ✅  Created: #{data['id']} {data['title']} ({len(data.get('testcases',[]))} testcases)")
            elif resp.status_code == 409:
                print(f"  ⏭️  Skipped (already exists): {prob['title']}")
            else:
                print(f"  ❌  Failed: {prob['title']} — {resp.status_code}: {resp.text[:200]}")
        except Exception as e:
            print(f"  ❌  Error: {prob['title']} — {e}")


if __name__ == "__main__":
    print("Seeding 10 problems...\n")
    seed()
    print("\nDone! Verify at: http://localhost:8000/api/v1/problems")
