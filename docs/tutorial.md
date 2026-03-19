# Veritas 使用教程

## 完整示例：从零开始生成测试

### 步骤 1: 安装 Veritas

```bash
npm install -g veritas
```

### 步骤 2: 创建待测试组件

创建 `src/components/Counter.tsx`:

```tsx
import React, { useState } from 'react';

interface CounterProps {
  initialValue?: number;
  onChange?: (value: number) => void;
}

export function Counter({ initialValue = 0, onChange }: CounterProps) {
  const [count, setCount] = useState(initialValue);

  const increment = () => {
    const newValue = count + 1;
    setCount(newValue);
    onChange?.(newValue);
  };

  const decrement = () => {
    const newValue = count - 1;
    setCount(newValue);
    onChange?.(newValue);
  };

  return (
    <div>
      <span data-testid="count">{count}</span>
      <button onClick={decrement} aria-label="Decrease">-</button>
      <button onClick={increment} aria-label="Increase">+</button>
    </div>
  );
}
```

### 步骤 3: 录制流量（可选）

如果你想基于真实数据生成测试：

```bash
# 启动开发服务器
npm run dev

# 在另一个终端录制
veritas record http://localhost:3000
```

### 步骤 4: 生成测试

```bash
# 生成测试
veritas generate src/components/Counter.tsx
```

### 步骤 5: 查看生成的测试

生成的测试文件 `tests/Counter.test.tsx`:

```tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Counter } from '../src/components/Counter';

describe('Counter', () => {
  it('should render with initial value', () => {
    render(<Counter initialValue={5} />);
    expect(screen.getByTestId('count')).toHaveTextContent('5');
  });

  it('should increment count', () => {
    render(<Counter />);
    const incrementButton = screen.getByLabelText('Increase');
    fireEvent.click(incrementButton);
    expect(screen.getByTestId('count')).toHaveTextContent('1');
  });

  it('should decrement count', () => {
    render(<Counter initialValue={5} />);
    const decrementButton = screen.getByLabelText('Decrease');
    fireEvent.click(decrementButton);
    expect(screen.getByTestId('count')).toHaveTextContent('4');
  });

  it('should call onChange callback', () => {
    const onChange = vi.fn();
    render(<Counter onChange={onChange} />);
    fireEvent.click(screen.getByLabelText('Increase'));
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
```

## Mock 数据生成

### 从流量生成 Mock

```bash
# 录制流量
veritas record http://localhost:3000 --output traffic.json

# 生成 MSW Mock
veritas mock traffic.json --output ./mocks --format msw
```

### 生成 Vitest Mock

```bash
veritas mock traffic.json --output ./mocks --format vitest
```

## 高级配置

### 使用 AI 模型

```json
{
  "ai": {
    "provider": "anthropic",
    "model": "claude-3-5-sonnet-20241022",
    "temperature": 0.7
  }
}
```

### 自定义测试模板

```json
{
  "generator": {
    "template": "./templates/my-template.ts"
  }
}
```

### 插件配置

```json
{
  "plugins": [
    "jest-snapshot",
    "rtl",
    {
      "name": "coverage",
      "options": {
        "threshold": 80
      }
    }
  ]
}
```

## 最佳实践

### 1. 保持组件简单

越简单的组件，生成的测试质量越高。

### 2. 提供完整类型定义

使用 TypeScript 并提供完整的类型定义：

```tsx
interface ButtonProps {
  /** 按钮文字 */
  label: string;
  /** 点击事件 */
  onClick: () => void;
  /** 按钮类型 */
  variant?: 'primary' | 'secondary';
  /** 是否禁用 */
  disabled?: boolean;
}
```

### 3. 使用流量录制

真实流量数据能显著提高测试质量：

```bash
veritas auto src/components/LoginForm.tsx \
  --url http://localhost:3000 \
  --record
```

### 4. 结合手动测试

AI 生成的测试是起点，需要人工审查和补充：

1. 运行生成的测试
2. 检查覆盖率
3. 补充边界情况
4. 添加集成测试
