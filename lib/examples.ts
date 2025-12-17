import { CodeExample } from '@/types';

export const codeExamples: CodeExample[] = [
    {
        name: 'Python - User Authentication',
        language: 'python',
        description: 'Login validation with error handling',
        code: `def authenticate_user(username, password):
    """Authenticate user credentials"""
    if not username or not password:
        return {"error": "Missing credentials"}
    
    user = database.find_user(username)
    
    if user is None:
        return {"error": "User not found"}
    
    if not verify_password(password, user.password_hash):
        log_failed_attempt(username)
        return {"error": "Invalid password"}
    
    if user.is_locked:
        return {"error": "Account locked"}
    
    session = create_session(user)
    return {"success": True, "session": session}`,
    },
    {
        name: 'JavaScript - Data Processing',
        language: 'javascript',
        description: 'Async data fetching and transformation',
        code: `async function processUserData(userId) {
  try {
    const user = await fetchUser(userId);
    
    if (!user) {
      throw new Error('User not found');
    }
    
    const posts = await fetchUserPosts(user.id);
    const comments = await fetchUserComments(user.id);
    
    const processedData = {
      user: user,
      totalPosts: posts.length,
      totalComments: comments.length,
      activity: calculateActivity(posts, comments)
    };
    
    return processedData;
  } catch (error) {
    console.error('Processing failed:', error);
    return null;
  }
}`,
    },
    {
        name: 'TypeScript - State Machine',
        language: 'typescript',
        description: 'Order status state machine',
        code: `type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

function updateOrderStatus(
  currentStatus: OrderStatus,
  action: string
): OrderStatus {
  switch (currentStatus) {
    case 'pending':
      if (action === 'confirm') {
        return 'processing';
      } else if (action === 'cancel') {
        return 'cancelled';
      }
      break;
    
    case 'processing':
      if (action === 'ship') {
        return 'shipped';
      } else if (action === 'cancel') {
        return 'cancelled';
      }
      break;
    
    case 'shipped':
      if (action === 'deliver') {
        return 'delivered';
      }
      break;
    
    default:
      return currentStatus;
  }
  
  return currentStatus;
}`,
    },
    {
        name: 'Python - Binary Search',
        language: 'python',
        description: 'Classic binary search algorithm',
        code: `def binary_search(arr, target):
    """Find target in sorted array using binary search"""
    left = 0
    right = len(arr) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1  # Not found`,
    },
    {
        name: 'C++ - Class Example',
        language: 'cpp',
        description: 'Simple class with inheritance',
        code: `class Shape {
protected:
    string color;
    
public:
    Shape(string c) : color(c) {}
    virtual double area() = 0;
    virtual void draw() = 0;
};

class Circle : public Shape {
private:
    double radius;
    
public:
    Circle(string c, double r) : Shape(c), radius(r) {}
    
    double area() override {
        return 3.14159 * radius * radius;
    }
    
    void draw() override {
        cout << "Drawing " << color << " circle" << endl;
    }
};`,
    },
    {
        name: 'Java - Singleton Pattern',
        language: 'java',
        description: 'Thread-safe singleton implementation',
        code: `public class DatabaseConnection {
    private static volatile DatabaseConnection instance;
    private Connection connection;
    
    private DatabaseConnection() {
        // Private constructor
        this.connection = createConnection();
    }
    
    public static DatabaseConnection getInstance() {
        if (instance == null) {
            synchronized (DatabaseConnection.class) {
                if (instance == null) {
                    instance = new DatabaseConnection();
                }
            }
        }
        return instance;
    }
    
    public Connection getConnection() {
        return this.connection;
    }
}`,
    },
];

export const getExampleByName = (name: string): CodeExample | undefined => {
    return codeExamples.find(example => example.name === name);
};

export const getExamplesByLanguage = (language: string): CodeExample[] => {
    return codeExamples.filter(example => example.language === language);
};
