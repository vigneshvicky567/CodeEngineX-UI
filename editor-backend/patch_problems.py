"""
One-time patch script — fixes problems 1, 2, 3 whose metadata columns
were empty because they were seeded before the 0002 migration ran.

Run inside the container:
  docker exec rce-backend-mvp-api-1 python patch_problems.py
"""
import json
import httpx

BASE = "http://localhost:8000/api/v1"

PATCHES = [
    # ── ID 1: Add Two Numbers (old placeholder) — replace with proper content
    {
        "id": 1,
        "slug_check": None,   # don't validate slug for old placeholders
        "patch": {
            "title": "Add Two Numbers",
            "difficulty": "medium",
            "description": "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.\n\nFor this problem, represent the linked list as a plain integer and return the sum.",
            "examples_json": json.dumps([
                {"input": "l1 = 342, l2 = 465", "output": "807", "explanation": "342 + 465 = 807."},
                {"input": "l1 = 0, l2 = 0", "output": "0"},
                {"input": "l1 = 9999999, l2 = 9999", "output": "10009998"},
            ]),
            "constraints_json": json.dumps([
                "The number of nodes in each linked list is in the range [1, 100].",
                "0 ≤ Node.val ≤ 9",
                "It is guaranteed that the list represents a number that does not have leading zeros.",
            ]),
            "code_templates_json": json.dumps({
                "python": "def addTwoNumbers(l1, l2):\n    # Write your solution here\n    # Treat l1 and l2 as plain integers\n    return l1 + l2\n\nl1 = int(input())\nl2 = int(input())\nprint(addTwoNumbers(l1, l2))\n",
                "cpp": '#include <iostream>\nusing namespace std;\n\nlong long addTwoNumbers(long long l1, long long l2) {\n    // Write your solution here\n    return l1 + l2;\n}\n\nint main() {\n    long long l1, l2;\n    cin >> l1 >> l2;\n    cout << addTwoNumbers(l1, l2) << endl;\n}\n',
                "java": 'import java.util.*;\n\nclass Solution {\n    public long addTwoNumbers(long l1, long l2) {\n        // Write your solution here\n        return l1 + l2;\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        long l1 = sc.nextLong(), l2 = sc.nextLong();\n        System.out.println(new Solution().addTwoNumbers(l1, l2));\n    }\n}\n',
                "c": '#include <stdio.h>\n\nlong long addTwoNumbers(long long l1, long long l2) {\n    // Write your solution here\n    return l1 + l2;\n}\n\nint main() {\n    long long l1, l2;\n    scanf("%lld %lld", &l1, &l2);\n    printf("%lld\\n", addTwoNumbers(l1, l2));\n}\n',
            }),
        },
    },
    # ── ID 2: Sum of Two Numbers (old placeholder) — replace with Longest Common Prefix
    {
        "id": 2,
        "patch": {
            "title": "Longest Common Prefix",
            "difficulty": "easy",
            "description": "Write a function to find the longest common prefix string amongst an array of strings.\n\nIf there is no common prefix, return an empty string \"\".",
            "examples_json": json.dumps([
                {"input": 'strs = ["flower","flow","flight"]', "output": '"fl"', "explanation": "The longest common prefix is \"fl\"."},
                {"input": 'strs = ["dog","racecar","car"]', "output": '""', "explanation": "There is no common prefix among the input strings."},
            ]),
            "constraints_json": json.dumps([
                "1 ≤ strs.length ≤ 200",
                "0 ≤ strs[i].length ≤ 200",
                "strs[i] consists of only lowercase English letters.",
            ]),
            "code_templates_json": json.dumps({
                "python": 'import json\n\ndef longestCommonPrefix(strs):\n    # Write your solution here\n    return ""\n\nstrs = json.loads(input())\nprint(json.dumps(longestCommonPrefix(strs)))\n',
                "cpp": '#include <iostream>\n#include <vector>\n#include <string>\nusing namespace std;\n\nstring longestCommonPrefix(vector<string>& strs) {\n    // Write your solution here\n    return "";\n}\n\nint main() {\n    int n; cin >> n; cin.ignore();\n    vector<string> strs(n);\n    for (auto& s : strs) getline(cin, s);\n    cout << "\\"" << longestCommonPrefix(strs) << "\\"" << endl;\n}\n',
                "java": 'import java.util.*;\n\nclass Solution {\n    public String longestCommonPrefix(String[] strs) {\n        // Write your solution here\n        return "";\n    }\n\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n        int n = Integer.parseInt(sc.nextLine().trim());\n        String[] strs = new String[n];\n        for (int i = 0; i < n; i++) strs[i] = sc.nextLine();\n        System.out.println("\\"" + new Solution().longestCommonPrefix(strs) + "\\"");\n    }\n}\n',
                "c": '#include <stdio.h>\n#include <string.h>\n\nvoid longestCommonPrefix(char strs[][201], int n, char* result) {\n    // Write your solution here\n    result[0] = \'\\0\';\n}\n\nint main() {\n    int n; scanf("%d\\n", &n);\n    char strs[200][201];\n    for (int i = 0; i < n; i++) fgets(strs[i], 201, stdin);\n    char result[201];\n    longestCommonPrefix(strs, n, result);\n    printf("\\"%s\\"\\n", result);\n}\n',
            }),
        },
    },
    # ── ID 3: Two Sum — already has testcases, just needs metadata filled in
    {
        "id": 3,
        "patch": {
            "title": "Two Sum",
            "difficulty": "easy",
            "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.",
            "examples_json": json.dumps([
                {"input": "nums = [2,7,11,15], target = 9", "output": "[0, 1]", "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."},
                {"input": "nums = [3,2,4], target = 6", "output": "[1, 2]"},
                {"input": "nums = [3,3], target = 6", "output": "[0, 1]"},
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
                "c": '#include <stdio.h>\n#include <stdlib.h>\n\nvoid twoSum(int* nums, int n, int target, int* res) {\n    // Write your solution here\n}\n\nint main() {\n    char line[4096]; fgets(line, sizeof(line), stdin);\n    int nums[10000], n=0; char *p=line;\n    while(*p){if(*p==\'-\'||(*p>=\'0\'&&*p<=\'9\')){nums[n++]=atoi(p);while(*p==\'-\'||(*p>=\'0\'&&*p<=\'9\'))p++;}else p++;}\n    int target; scanf("%d",&target);\n    int res[2]={-1,-1}; twoSum(nums,n,target,res);\n    printf("[%d, %d]\\n",res[0],res[1]);\n}\n',
            }),
        },
    },
]


def run():
    print("Patching problems 1, 2, 3 with full metadata...\n")
    for entry in PATCHES:
        pid = entry["id"]
        patch = entry["patch"]
        try:
            resp = httpx.patch(f"{BASE}/problems/{pid}", json=patch, timeout=10)
            if resp.is_success:
                data = resp.json()
                print(f"  ✅  Patched #{pid}: {data['title']}  —  desc={len(data['description'])} chars")
            else:
                print(f"  ❌  Failed #{pid}: {resp.status_code} {resp.text[:200]}")
        except Exception as e:
            print(f"  ❌  Error #{pid}: {e}")
    print("\nDone! Verify at: http://localhost:8000/api/v1/problems/1")


if __name__ == "__main__":
    run()
