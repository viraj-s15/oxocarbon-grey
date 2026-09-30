// A small fixed-size matrix library, used for theme previews.
#include <algorithm>
#include <array>
#include <concepts>
#include <iostream>
#include <memory>
#include <string>
#include <vector>
#include "config.h"

#define MATRIX_VERSION "2.1"
#define CHECK(cond) \
    do { if (!(cond)) throw std::logic_error(#cond); } while (0)

#ifndef NDEBUG
#  define LOG(msg) std::clog << msg << '\n'
#else
#  define LOG(msg)
#endif

namespace linalg {

template <typename T>
concept Numeric = std::integral<T> || std::floating_point<T>;

enum class Layout : unsigned char { RowMajor, ColumnMajor };

constexpr std::size_t kMaxDim = 16;

template <Numeric T, std::size_t R, std::size_t C>
class Matrix {
public:
    using value_type = T;
    static constexpr Layout layout = Layout::RowMajor;

    constexpr Matrix() noexcept = default;
    explicit Matrix(std::initializer_list<T> values) {
        CHECK(values.size() <= R * C);
        std::copy(values.begin(), values.end(), data_.begin());
    }

    [[nodiscard]] constexpr T& operator()(std::size_t r, std::size_t c) noexcept {
        return data_[r * C + c];
    }
    [[nodiscard]] constexpr const T& operator()(std::size_t r, std::size_t c) const noexcept {
        return data_[r * C + c];
    }

    template <std::size_t K>
    Matrix<T, R, K> operator*(const Matrix<T, C, K>& other) const {
        Matrix<T, R, K> result{};
        for (std::size_t i = 0; i < R; ++i)
            for (std::size_t j = 0; j < K; ++j)
                for (std::size_t k = 0; k < C; ++k)
                    result(i, j) += (*this)(i, k) * other(k, j);
        return result;
    }

    bool operator==(const Matrix&) const = default;

    T trace() const requires (R == C) {
        T sum{};
        for (std::size_t i = 0; i < R; ++i) sum += (*this)(i, i);
        return sum;
    }

private:
    std::array<T, R * C> data_{};
};

consteval std::size_t area(std::size_t r, std::size_t c) { return r * c; }

struct Report {
    std::string name;
    std::vector<double> values;
    const volatile int* sensor = nullptr;
};

}  // namespace linalg

static std::unique_ptr<linalg::Report> make_report(std::string&& name) {
    auto report = std::make_unique<linalg::Report>();
    report->name = std::move(name);
    return report;
}

int main(int argc, char** argv) {
    using namespace linalg;
    Matrix<int, 2, 2> a{1, 2, 3, 4};
    Matrix<int, 2, 2> b{5, 6, 7, 8};
    auto c = a * b;

    const auto threshold = 10;
    auto count = std::count_if(argv, argv + argc, [threshold, &c](const char* arg) {
        return std::string_view{arg}.size() > static_cast<std::size_t>(threshold) && c.trace() > 0;
    });

    auto report = make_report("trace");
    report->values.push_back(static_cast<double>(c.trace()));
    const char* banner = R"(Matrix "demo")";
    LOG(banner << " v" << MATRIX_VERSION);

    if (a == b || count > 0) {
        std::cout << "equal or args: " << count << std::endl;
    }
    static_assert(area(4, 4) == kMaxDim, "unexpected size");
    return report->values.empty() ? 1 : 0;
}
